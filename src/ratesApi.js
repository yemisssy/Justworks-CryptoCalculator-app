//Fetch rates and filter for only 2

export const fetchCryptoRate = async () => {
  const selectedRates = ["BTC", "ETH"];
  try {
    const response = await fetch(
      "https://api.coinbase.com/v2/exchange-rates?currency=USD",
    );
    if (!response.ok) {
      throw new Error(`Response Failed ${response.status}`);
    }

    const data = await response.json();
    const allRates = data.data.rates; // these are objects
    console.log(allRates);
    const neededRates = Object.fromEntries(
      //Question: What is the syntax ([key]) inside the filter? is it a shortand?
      Object.entries(allRates).filter(([key]) => selectedRates.includes(key)),
    );
    return neededRates;
  } catch (e) {
    console.error(e);
  }
};
