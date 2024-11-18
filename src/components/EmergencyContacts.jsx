import React, { useState } from "react";
import { Phone } from "lucide-react";

const EmergencyContacts = () => {
  const [isOpen, setIsOpen] = useState(false);

  const contacts = [
    { name: "Site Manager", phone: "123-456-7890" },
    { name: "Emergency Services", phone: "911" },
    { name: "Safety Officer", phone: "123-456-7891" },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className="relative"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <button className="bg-red-500 dark:bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-600 dark:hover:bg-red-700">
          <Phone size={24} />
        </button>

        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 min-w-[200px]">
            {contacts.map((contact) => (
              <a
                key={contact.phone}
                href={`tel:${contact.phone}`}
                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <p className="font-medium text-gray-900 dark:text-white">
                  {contact.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {contact.phone}
                </p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyContacts;
