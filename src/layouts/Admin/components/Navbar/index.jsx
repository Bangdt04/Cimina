import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  IconDashboard,
  IconMovie,
  IconChefHat,
  IconUsers,
  IconCreditCard,
  IconCalendar,
  IconTags,
  IconArmchair,
  IconDoor,
  IconAddressBook,
  IconArticle,
  IconTicket,
  IconMessageCircle2,
  IconWheel
} from '@tabler/icons-react';
import './navbar.scss';

const menuItems = [
  { name: 'Dashboard', icon: IconDashboard, path: '/admin/dashboard' },
  { name: 'Movies', icon: IconMovie, path: '/admin/movies' },
  { name: 'Food', icon: IconChefHat, path: '/admin/food' },
  { name: 'Users', icon: IconUsers, path: '/admin/users' },
  { name: 'Payments', icon: IconCreditCard, path: '/admin/payments' },
  { name: 'Bookings', icon: IconCalendar, path: '/admin/bookings' },
  { name: 'Movie Genre', icon: IconTags, path: '/admin/movie-genre' },
  { name: 'Seat', icon: IconArmchair, path: '/admin/seat' },
  { name: 'Room', icon: IconDoor, path: '/admin/room' },
  { name: 'Contact', icon: IconAddressBook, path: '/admin/contact' },
  { name: 'Blog', icon: IconArticle, path: '/admin/blog' },
  { name: 'Voucher', icon: IconTicket, path: '/admin/voucher' },
  { name: 'Feedback', icon: IconMessageCircle2, path: '/admin/feedback' },
  { name: 'Lucky Wheel', icon: IconWheel, path: '/admin/lucky-wheel' },
];

function Sidebar() {
    const location = useLocation();
  
    return (
      <nav className="sidebar fixed">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

export default Sidebar;