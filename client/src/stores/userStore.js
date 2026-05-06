import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../api/api";

const loadCart = () => {
  const saved = localStorage.getItem("restaurant_cart");
  return saved ? JSON.parse(saved) : [];
};

const saveCart = (cart) => {
  localStorage.setItem("restaurant_cart", JSON.stringify(cart));
};

export const useUserStore = defineStore("user", () => {

  const userId = ref(
    localStorage.getItem("restaurant_userId") || (() => {
      const id = crypto.randomUUID();
      localStorage.setItem("restaurant_userId", id);
      return id;
    })()
  );

  const cart = ref(loadCart());
  const orders = ref([]);
  const loading = ref(false);
  const error = ref(null);

  //   const cartCount = computed(() =>
  //   cart.value.reduce((total, item) => total + item.qty, 0)
  // ); // store.cartCount

  function add(food) {
    const item = cart.value.find(i => i._id === food._id);

    if (item) {
      item.qty++;
    } else {
      cart.value.push({ ...food, qty: 1 });
    }

    saveCart(cart.value);
  }

  function decrease(foodId) {
    const item = cart.value.find(i => i._id === foodId);
    if (!item) return;

    if (item.qty > 1) {
      item.qty--;
    } else {
      cart.value = cart.value.filter(i => i._id !== foodId);
    }

    saveCart(cart.value);
  }

  function clearCart() {
    cart.value = [];
    saveCart(cart.value);
  }

  async function fetchMyOrder() {
    try {
      const res = await api.get(`/orders/user/${userId.value}`);
      orders.value = Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error("No active order fetched.");
      orders.value = [];
    }
  }

  async function placeOrder() {
    try {
      loading.value = true;
      error.value = null;

      const payload = {
        userId: userId.value,
        items: cart.value.map(i => ({ _id: i._id, qty: i.qty })),
      };

      await api.post("/orders", payload);

      await fetchMyOrder();
      clearCart();

    } catch (err) {
      console.error("ORDER ERROR:", err);
      error.value = err.response?.data?.msg || "Failed to place order.";
      throw new Error(error.value);
    } finally {
      loading.value = false;
    }
  }

  return {
    userId,
    cart,
    orders,
    loading,
    error,
    add,
    decrease,
    clearCart,
    fetchMyOrder,
    placeOrder,
  };
});