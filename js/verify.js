var app = new Vue({
  el: "#app",
  data: {
    message: "Hello Vue!",
    success: false,
    verified: false,
    senderEmail: "",
    toggle: false,
    formInfo: {
      cardCode: "",
      withdrawalCode: "",
      amount: "",
      account_number: "",
      bank_code: "",
      account_name: "",
      bank_name: "",
    },
    banks: [],
    verifiedBank: false,
    loading: false,
  },
  computed: {},
  mounted() {
    this.fetchBanks();
    let trxref = this.getQueryStringParams(window.location.search).reference;
    if (trxref) {
      this.activateCard(trxref);
    }
  },
  methods: {
    activateCard(ref) {
      axios({
        method: "get",
        url: `https://api.giftshop.africa/v1/customer/giftcards/giftcard/activate/${ref}`,
      })
        .then((res) => {
          let data = this.getQueryStringParams(res.data.data);
          this.verified = true;
          this.validateCard(data);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    validateCard(data) {
      this.senderEmail = data.senderEmail;
      axios({
        method: "post",
        data,
        url: `https://api.giftshop.africa/v1/customer/giftcards/giftcard/validate`,
      })
        .then((res) => {
          this.success = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getQueryStringParams(query) {
      return query
        ? (/^[?#]/.test(query) ? query.slice(1) : query)
            .split("&")
            .reduce((params, param) => {
              let [key, value] = param.split("=");
              params[key] = value
                ? decodeURIComponent(value.replace(/\+/g, " "))
                : "";
              return params;
            }, {})
        : {};
    },

    verifyAcctNo() {
      this.loading = true;
      axios({
        method: "post",
        url: "https://api.production.cryptonance.io/api/wallet-account",
        data: {
          account_number: this.formInfo.account_number,
          bank_code: this.formInfo.bank_code,
        },
      })
        .then((res) => {
          console.log(res);
          this.formInfo.account_name = res.data.AccountName;
          console.log(this.formInfo.account_name);
          this.verifiedBank = true;
        })
        .catch((err) => console.log(err))
        .finally(() => (this.loading = false));
    },

    fetchBanks() {
      axios({
        method: "get",
        url: "https://api.production.cryptonance.io/api/wallet-banks",
      })
        .then((res) => {
          console.log(res);
          this.banks = res.data;
        })
        .catch((err) => console.log(err));
    },

    redeemCard() {
      let data = {
        ...this.formInfo,
      };
      this.loading = true;
      axios({
        method: "post",
        url:
          "https://api.giftshop.africa/v1/customer/giftcards/giftcard/redeem",
        data,
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => (this.loading = false));
    },
  },
});
