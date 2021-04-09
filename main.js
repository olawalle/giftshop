var app = new Vue({
  el: "#app",
  data: {
    message: "Hello Vue!",
    items: [1, 2, 3],
    toggle: false,
    fetchingCardInfo: true,
    canActivate: false,
    creatingCard: false,
    amount: "",
    url: "",
    cardCode: "",
    newCardDetails: {
      receiverEmail: "olawalle94@gmail.com",
      receiverName: "Sam smith",
      senderEmail: "olawalle94@gmail.com",
      senderName: "olawale ariyo",
      amount: "2000",
      cardCurrency: "NGN",
      callbackUrl: "",
    },
  },
  computed: {},
  mounted() {
    let ref = window.location.search
      ? window.location.search.replace("?", "").split("=")[1]
      : null;
    if (ref) {
      $("#exampleModalCenter").modal("show");
      this.getCardInfo(ref);
    }
  },
  methods: {
    pickCardType(e) {
      this.creatingCard = true;
    },
    createCard() {
      let data = {
        ...this.newCardDetails,
        callbackUrl: `${window.location}`,
        // receiverEmail: "olawalle94@gmail.com",
      };
      axios({
        method: "post",
        url:
          "https://api.giftshop.africa/v1/customer/giftcards/giftcard/create",
        data,
      })
        .then((res) => {
          this.getCardInfo(res.data.data.cardReference);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getCardInfo(ref) {
      this.fetchingCardInfo = true;
      axios({
        method: "get",
        url: `https://api.giftshop.africa/v1/customer/giftcards/giftcard/view/${ref}`,
      })
        .then((res) => {
          this.url = res.data.data.paymentUrl;
          this.amount = res.data.data.amount;
          this.cardCode = res.data.data.cardCode
            .replace(/\W/gi, "")
            .replace(/(.{4})/g, "$1 ");
          this.canActivate = true;
        })
        .catch((err) => {
          console.log(err);
        });
      // .finally(() => (this.fetchingCardInfo = false));
    },
    activateCard() {
      window.open(this.url, "_self");
    },
  },
});

// cardReference=0s7pwnbz2&cardCode=2915129026100373&cardPin=489004&senderEmail=olawalle94@gmail.com

// To remove the .html extension from your urls, you can use the following code in root/htaccess :

// RewriteEngine on

// RewriteCond %{THE_REQUEST} /([^.]+)\.html [NC]
// RewriteRule ^ /%1 [NC,L,R]

// RewriteCond %{REQUEST_FILENAME}.html -f
// RewriteRule ^ %{REQUEST_URI}.html [NC,L]
