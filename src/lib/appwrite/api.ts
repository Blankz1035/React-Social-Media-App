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

  // ============================== Queries
  export async function getRecentPosts() {
    const posts = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.postsCollectionId,
      [Query.orderDesc('$createdAt'), Query.limit(20)]
    )

    if(!posts) throw Error;

    return posts
  }

  export async function likePost (postId: string, likesArray: string[]){
    try {
      const updatedPost = await databases.updateDocument(
        appWriteConfig.databaseId,
        appWriteConfig.postsCollectionId,
        postId,
        {
          likes: likesArray
        }
      )
      if(!updatedPost) throw Error

      
      return updatedPost;
    } catch (error) {
      console.log(error)
    }
  }

  export async function savePost (postId: string, userId: string){
    try {
      const updatedPost = await databases.createDocument(
        appWriteConfig.databaseId,
        appWriteConfig.savesCollectionId,
        ID.unique(),
        {
          user: userId,
          post: postId
        }
      )
      if(!updatedPost) throw Error


      return updatedPost;
    } catch (error) {
      console.log(error)
    }
  }

  export async function deleteSavedPost (savedRecordId: string){
    try {
      const statusCode = await databases.deleteDocument(
        appWriteConfig.databaseId,
        appWriteConfig.savesCollectionId,
        savedRecordId
      )
      if(!statusCode) throw Error


      return {status: "ok"};

    } catch (error) {
      console.log(error)
    }
  }

  export async function getPostById (postId: string){
    try {
      const post = await databases.getDocument(
        appWriteConfig.databaseId,
        appWriteConfig.postsCollectionId,
        postId
      )
    
      return post;
      
    } catch (error) {
      console.log(error)
    }
  }

  // ============================== Update POST
export async function updatePost(post: INewPost) {
  const hasFileToUpdate = post.file.length > 0 

  try {
    let image = {
      imageId : post.imageId,
      imageUrl: post.imageUrl,
    }

    if(hasFileToUpdate) {
      // Upload file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);

      if (!uploadedFile) throw Error; // Should be a file uploaded.

      // Get file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id); // delete file if something went wrong
        throw Error;
      }

      image = {...imageId, imageUrl: fileUrl, imageId:uploadFile}
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Update post in DB
    const updatedPost = await databases.updateDocument(
      appWriteConfig.databaseId,
      appWriteConfig.postsCollectionId,
      post.postId,
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );
    
    // failsafe to remove file again if something went wrong.
    if (!updatedPost) {
      await deleteFile(post.imageId);
      throw Error;
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePost (postId: string, imageId: string){
  if(!postId || !imageId) throw Error

  try {
   const statusCode = await databases.deleteDocument(
      appWriteConfig.databaseId,
      appWriteConfig.postsCollectionId,
      postId
    )
    if(!statusCode) throw Error


    return {status: "ok"};

  } catch (error) {
    console.log(error)
  }
}

export async function getInfinitePosts({pageParam}: {pageParam: number}) {
  const queries: any[] = [Query.orderDesc('$updateAt'), Query.limit(10)]

  if(pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()))
  }
  
  try {
    const posts = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.postsCollectionId,
      queries
    )

    if(!posts) throw Error

    return posts
  } catch (error) {
    console.log(error)
  }
}
export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appWriteConfig.databaseId,
      appWriteConfig.postsCollectionId,
      [Query.search('caption', searchTerm)]
    )

    if(!posts) throw Error

    return posts
  } catch (error) {
    console.log(error)
  }
}