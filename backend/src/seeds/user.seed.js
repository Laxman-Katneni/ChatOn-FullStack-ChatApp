import { config } from "dotenv";
import { connect_db } from "../lib/db.js";
import User from "../models/user.model.js";

config();

const seedUsers = [
  // Female Users
  {
    email: "grace.hall@example.com",
    full_name: "Grace Hall",
    password: "123456",
    profile_pic: "https://randomuser.me/api/portraits/women/9.jpg",
  },
  {
    email: "chloe.lee@example.com",
    full_name: "Chloe Lee",
    password: "123456",
    profile_pic: "https://randomuser.me/api/portraits/women/10.jpg",
  },
  {
    email: "ella.young@example.com",
    full_name: "Ella Young",
    password: "123456",
    profile_pic: "https://randomuser.me/api/portraits/women/11.jpg",
  },
  {
    email: "scarlett.king@example.com",
    full_name: "Scarlett King",
    password: "123456",
    profile_pic: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    email: "lily.scott@example.com",
    full_name: "Lily Scott",
    password: "123456",
    profile_pic: "https://randomuser.me/api/portraits/women/13.jpg",
  },
  {
    email: "nora.green@example.com",
    full_name: "Nora Green",
    password: "123456",
    profile_pic: "https://randomuser.me/api/portraits/women/14.jpg",
  },
  {
    email: "zoe.baker@example.com",
    full_name: "Zoe Baker",
    password: "123456",
    profile_pic: "https://randomuser.me/api/portraits/women/15.jpg",
  },
  {
    email: "hazel.adams@example.com",
    full_name: "Hazel Adams",
    password: "123456",
    profile_pic: "https://randomuser.me/api/portraits/women/16.jpg",
  },

  // Male Users
  {
    email: "jack.thomas@example.com",
    full_name: "Jack Thomas",
    password: "123456",
    profile_pic: "https://randomuser.me/api/portraits/men/9.jpg",
  },
  {
    email: "logan.white@example.com",
    full_name: "Logan White",
    password: "123456",
    profile_pic: "https://randomuser.me/api/portraits/men/10.jpg",
  },
  {
    email: "sebastian.harris@example.com",
    full_name: "Sebastian Harris",
    password: "123456",
    profile_pic: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    email: "leo.walker@example.com",
    full_name: "Leo Walker",
    password: "123456",
    profile_pic: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    email: "mason.robinson@example.com",
    full_name: "Mason Robinson",
    password: "123456",
    profile_pic: "https://randomuser.me/api/portraits/men/13.jpg",
  },
  {
    email: "elijah.perez@example.com",
    full_name: "Elijah Perez",
    password: "123456",
    profile_pic: "https://randomuser.me/api/portraits/men/14.jpg",
  },
  {
    email: "owen.carter@example.com",
    full_name: "Owen Carter",
    password: "123456",
    profile_pic: "https://randomuser.me/api/portraits/men/15.jpg",
  },
];

const seedDatabase = async () => {
  try {
    await connect_db();
    await User.insertMany(seedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

seedDatabase();
