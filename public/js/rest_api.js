/**
 * Gọi API với các tham số động
 * @param {string} url - Đường dẫn API
 * @param {object} params - Dữ liệu gửi đi (body hoặc query)
 * @param {string} method - Phương thức HTTP (GET, POST, PUT, DELETE, ...)
 * @returns {Promise}
 */
// console.log("callApi");
// nhúng axios   
// Đảm bảo axios đã được nhúng, nếu chưa thì tự động thêm vào
(function ensureAxiosLoaded() {
  if (typeof window.axios === 'undefined') {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js';
    script.onload = function() {
      console.log('Axios loaded dynamically');
    };
    document.head.appendChild(script);
  }
})();
window.callApi = function({ url, params = {}, method = 'GET' }) {
  const config = {
    url,
    method: method.toUpperCase(),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  if (method.toUpperCase() === 'GET') {
    config.params = params;
  } else {
    config.data = params;
  }

  return axios(config);
}; 