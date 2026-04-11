import { defineStore } from "pinia";
import api from "../api/api";

const loadCart = () => {
  const saved = localStorage.getItem("restaurant_cart");
  return saved ? JSON.parse(saved) : [];
};

const saveCart = (cart) => {
  localStorage.setItem("restaurant_cart", JSON.stringify(cart));
};

export const useUserStore = defineStore("user", {
  state: () => ({
    userId: localStorage.getItem("restaurant_userId") || (() => {
      const id = crypto.randomUUID();
      localStorage.setItem("restaurant_userId", id);
      return id;
    })(),
    cart: loadCart(),
    orders: [],
    loading: false,
    error: null,
  }),

  actions: {
    add(food) {
      const item = this.cart.find(i => i._id === food._id);
      if (item) {
        item.qty++;
      } else {
        this.cart.push({ ...food, qty: 1 });
      }
      saveCart(this.cart);
    },

    decrease(foodId) {
      const item = this.cart.find(i => i._id === foodId);
      if (!item) return;

      if (item.qty > 1) {
        item.qty--;
      } else {
        this.cart = this.cart.filter(i => i._id !== foodId);
      }
      saveCart(this.cart);
    },

    clearCart() {
      this.cart = [];
      saveCart(this.cart);
    },

    async fetchMyOrder() {
      try {
        const res = await api.get(`/orders/user/${this.userId}`);
        this.orders = Array.isArray(res.data) ? res.data : [];
      } catch (err) {
        console.error("No active order fetched.");
        this.orders = [];
      }
    },

    async placeOrder() {
      try {
        this.loading = true;
        this.error = null;

        const payload = {
          userId: this.userId,
          items: this.cart.map(i => ({ _id: i._id, qty: i.qty })),
        };

        const res = await api.post("/orders", payload);

        await this.fetchMyOrder();
        this.clearCart();

      } catch (err) {
        console.error("ORDER ERROR:", err);
        this.error = err.response?.data?.msg || "Failed to place order.";
        throw new Error(this.error);
      } finally {
        this.loading = false;
      }
    },
  },
});