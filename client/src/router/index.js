import { createRouter, createWebHistory } from "vue-router";

import UserLayout from "../layouts/UserLayout.vue";

import AdminLayout from "../layouts/AdminLayout.vue";

const Dashboard = () => import("../views/admin/Dashboard.vue");
const Categories = () => import("../views/admin/Categories.vue");
const Foods = () => import("../views/admin/Foods.vue");
const Orders = () => import("../views/admin/Orders.vue");
const Login = () => import("../views/admin/Login.vue");

const routes = [
  {
    path: "/",
    component: UserLayout,
    children: [
      {
        path: "",
        component: () => import("../views/user/Menu.vue"),
      },
      {
        path: "cart",
        component: () => import("../views/user/Cart.vue"),
      },
      {
        path: "status",
        component: () => import("../views/user/Status.vue"),
      },

    ],
  },

  {
    path: "/admin/login",
    component: Login,
  },

  {
    path: "/admin",
    component: AdminLayout,
    children: [
      {
        path: "",
        redirect: "/admin/dashboard",
      },
      {
        path: "dashboard",
        component: Dashboard,
      },
      {
        path: "categories",
        component: Categories,
      },
      {
        path: "foods",
        component: Foods,
      },
      {
        path: "orders",
        component: Orders,
      },
    ],
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.path.startsWith("/admin") && to.path !== "/admin/login" && !token) {
    return next("/admin/login");
  }

  next();
});

export default router;