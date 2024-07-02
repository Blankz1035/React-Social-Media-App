import { bottombarLinks } from '@/constants';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const BottomBar = () => {

  const navigate = useNavigate()
  const { pathname } = useLocation();


  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <Link
            key={`bottombar-${link.label}`}
            to={link.route}
            className={`${
              isActive && "rounded-[10px] bg-primary-500 "
            } flex-center flex-col gap-2 p-2 transition`}>
            <img
              src={link.imgURL}
              alt={link.label}
              width={20}
              height={20}
              className={`${isActive && "invert-white"}`}
            />

            <p className="tiny-medium text-light-2">{link.label}</p>
          </Link>
        );
      })}
    </section>
  )
}

export default BottomBar