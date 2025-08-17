import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineBell } from "react-icons/ai";
import { markAsRead } from "../../redux/notification/notificationSlice";

export default function NotificationBell() {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state) => state.notifications.notifications
  );
  const unreadNotifs = notifications.filter((n) => !n.read);

  const handleNotifClick = (id) => {
    dispatch(markAsRead(id));
  };

  return (
    <div className="relative group">
      <AiOutlineBell size={24} className="text-gray-700 cursor-pointer" />

      {unreadNotifs.length > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
          {unreadNotifs.length}
        </span>
      )}

      <div className="absolute right-0 mt-2 w-64 bg-white shadow rounded z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200">
        {notifications.length === 0 ? (
          <p className="p-2 text-sm text-gray-500">Không có thông báo</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleNotifClick(n.id)}
              className={`p-2 border-b cursor-pointer ${
                n.read ? "bg-gray-100" : "bg-white font-semibold"
              } hover:bg-gray-50`}
            >
              <p>{n.title}</p>
              <small className="text-gray-500">{n.message}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
