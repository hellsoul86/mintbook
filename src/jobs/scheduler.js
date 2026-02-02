function startScheduler({ priceService, config }) {
  setInterval(() => {
    priceService.refresh();
  }, config.PRICE_REFRESH_MS);
}

module.exports = {
  startScheduler,
};
