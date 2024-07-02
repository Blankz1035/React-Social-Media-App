import { ID, Query } from "appwrite";
import { INewPost, INewUser } from "@/types";
import { account, appWriteConfig, avatars, databases, storage } from "./config";

export async function createUserAccount(user: INewUser){

    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
        );
        // once complete, need to create users document.
        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl,
        });

        return newUser
    } catch (error) {
        console.log(error)
        return error
    }
}

export async function saveUserToDB(user: {
   accountId: string;
   email: string;
   name: string;
   imageUrl: URL;
   username?: string;
    })
    {
        // save doc to db
        try {
            const newUser = await databases.createDocument(
                appWriteConfig.databaseId,
                appWriteConfig.usersCollectionId,
                ID.unique(),
                user,
            )
            return newUser
        } catch (error) {
            console.log(error)
        }
}

export async function signInAccount(user: {email:string; password: string}){
    try {
        const session = await account.createEmailPasswordSession(user.email, user.password);
        return session
    } catch (error) {
        console.log(error)
    }
}
export async function getCurrentUser(){
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error

        const currentUser = await databases.listDocuments(
            appWriteConfig.databaseId,
            appWriteConfig.usersCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )
        
        if (!currentUser) throw Error

        return currentUser.documents[0]
    } catch (error) {
        console.log(error)
        return null;
    }
}

export async function signOutAccount(){
    try {
        const session = await account.deleteSession("current");
        return session
    } catch (error) {
        console.log(error)
    }
}


// POSTS
// ============================================================

// ============================== CREATE POST
export async function createPost(post: INewPost) {
    try {
      // Upload file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
  
      if (!uploadedFile) throw Error; // Should be a file uploaded.
  
      // Get file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id); // delete file if something went wrong
        throw Error;
      }
  
      // Convert tags into array
      const tags = post.tags?.replace(/ /g, "").split(",") || [];
  
      // Create post
      const newPost = await databases.createDocument(
        appWriteConfig.databaseId,
        appWriteConfig.postsCollectionId,
        ID.unique(),
        {
          creator: post.userId,
          caption: post.caption,
          imageUrl: fileUrl,
          imageId: uploadedFile.$id,
          location: post.location,
          tags: tags,
        }
      );
      
      // failsafe to remove file again if something went wrong.
      if (!newPost) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
  
      return newPost;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== UPLOAD FILE
  export async function uploadFile(file: File) {
    try {
      const uploadedFile = await storage.createFile(
        appWriteConfig.storageId,
        ID.unique(),
        file
      );
  
      return uploadedFile;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== GET FILE URL
  export function getFilePreview(fileId: string) {
    try {
      const fileUrl = storage.getFilePreview(
        appWriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
  
      if (!fileUrl) throw Error;
  
      return fileUrl;
    } catch (error) {
      console.log(error);
    }
  }

  // ============================== DELETE FILE
export async function deleteFile(fileId: string) {
    try {
      await storage.deleteFile(appWriteConfig.storageId, fileId);
  
      return { status: "ok" };
    } catch (error) {
      console.log(error);
    }
  }