class Form {
  constructor() {
    this.state = {
      tabIndex: 0,
      subscription: "monthly",
      plan: {
        name: "arcade",
        price: 9,
      },
      addons: [],
      hasError: false
    };

    this.$switchBtn = document.querySelector(".switch-btn");
    this.$nextStep = document.querySelector(".next-step");
    this.$formFooter = document.querySelector(".form-footer");
    this.$goBack = document.querySelector(".go-back");
    this.$confirmBtn = document.querySelector(".confirm-btn");
    this.$name = document.querySelector("#name");
    this.$email = document.querySelector("#email");
    this.$phoneNumber = document.querySelector("#phone-number");
    this.$planType = document.querySelector(".plan-type");
    this.$monthly = document.querySelector(".monthly");
    this.$yearly = document.querySelector(".yearly");
    this.$prices;
    this.$messages = document.querySelectorAll(".message");
    this.$planCards = document.querySelectorAll(".plan-card");
    this.$addons = document.querySelectorAll(".checkbox-container");
    this.$changeBtn = document.querySelector(".change-btn");
    this.$services = document.querySelector(".services");
    this.$totalSubType = document.querySelector(".total-sub-type");
    this.$totalPrice = document.querySelector(".total-price");
    this.$confirmBtn = document.querySelector(".confirm-btn");
    this.$mainForm = document.querySelector(".main-form");

    this.addEventListeners();
    this.setNextPage;
    this.setPrevPage;
    this.displayNewPage;
    this.validateForm;
    this.toggleSubscription;
    this.countPrice;
    this.selectPlan;
    this.selectAddon;
    this.adjustFinalCard;
    this.toCapitalized;
    this.toggleMessages;
    this.changePlan;
  }

  addEventListeners() {
    document.body.addEventListener("click", (e) => {
      this.selectPlan(e);
      this.selectAddon(e);
    });

    this.$switchBtn.addEventListener("click", () => {
      this.$switchBtn.classList.toggle("switch-on");

      this.toggleSubscription();
      this.toggleMessages();
    });

    this.$nextStep.addEventListener("click", (e) => {
      this.validateForm(e);
    });

    this.$goBack.addEventListener("click", () => {
      this.setPrevPage();
    });

    this.$changeBtn.addEventListener("click", () => {
      this.changePlan();

      this.displayNewPage();
    });

    this.$confirmBtn.addEventListener("click", () => {
      this.setNextPage();

      this.$mainForm.style.display = "none";
    });
  }

  setNextPage() {
    this.state.tabIndex = this.state.tabIndex + 1;

    this.displayNewPage();
  }

  setPrevPage() {
    this.state.tabIndex = this.state.tabIndex - 1;

    this.displayNewPage();
  }

  displayNewPage() {
    const pages = document.querySelectorAll(".page");
    const tabs = document.querySelectorAll(".number-of-step");

    pages.forEach((page, index) => {
      if (index === this.state.tabIndex) {
        page.removeAttribute("hidden");

        if (index === 3) {
          this.$nextStep.style.display = "none";
          this.$confirmBtn.style.display = "block";
        } else if (index === 4) {
          this.$formFooter.style.display = "none";
        } else if (index >= 1 && index !== 4 && index !== 3) {
          this.$nextStep.style.display = "block";
          this.$confirmBtn.style.display = "none";
          this.$goBack.style.display = "initial";
          this.$formFooter.style.justifyContent = "space-between";
        } else {
          this.$goBack.style.display = "none";
          this.$formFooter.style.justifyContent = "end";
        }
      } else {
        page.setAttribute("hidden", "");
      }
    });

    tabs.forEach((tab, index) => {
      if (index === this.state.tabIndex) {
        tab.classList.add("selected");
      } else {
        tab.classList.remove("selected");
      }
    });
  }

  setError(element, message) {
    const inputContainer = element.closest(".input-container")
    const errorMsg = inputContainer.querySelector(".error-msg")

    errorMsg.innerText = message
    element.style.borderColor = "#ed3548"

    this.state.hasError = true
  }

  disableError(element) {
    const inputContainer = element.closest(".input-container")
    const errorMsg = inputContainer.querySelector(".error-msg")

    errorMsg.innerText = ""
    element.style.borderColor = "#d6d9e6"
  }

  validateForm(e) {
    e.preventDefault();

    const name = this.$name.value.trim()
    const email = this.$email.value.trim()
    const phoneNumber = this.$phoneNumber.value.trim()

    this.state.hasError = false

    if (!name) {
      this.setError(this.$name, "This field is required")
    } else {
      this.disableError(this.$name)
    }

    if (!email) {
      this.setError(this.$email, "This field is required")
    } else if (this.$email.validity.typeMismatch) {
      this.setError(this.$email, "Invalid email address")
    } else {
      this.disableError(this.$email)
    }

    if (!phoneNumber) {
      this.setError(this.$phoneNumber, "This field is required")
    } else {
      this.disableError(this.$phoneNumber)
    }

    if (this.state.hasError) return;

    this.setNextPage();
  }

  changePlan() {
    this.state.tabIndex = 1;
  }

  toggleSubscription() {
    this.$monthly.classList.toggle("selected");
    this.$yearly.classList.toggle("selected");

    this.state.subscription =
      this.state.subscription === "monthly" ? "yearly" : "monthly";

    this.countPrice();
    this.adjustFinalCard();
  }

  countPrice() {
    this.$prices = document.querySelectorAll(".price");

    this.$prices.forEach((price) => {
      price.innerText =
        this.state.subscription === "yearly"
          ? `$${price.dataset.price * 10}/yr`
          : `$${price.dataset.price}/mo`;
    });
  }

  toggleMessages() {
    this.$messages.forEach((message) => {
      message.hidden = message.hidden ? false : true;
    });
  }

  selectPlan(e) {
    const currentCard = e.target.closest(".plan-card");

    if (!currentCard) return;

    this.$planCards.forEach((card) => {
      if (card !== currentCard) {
        card.classList.remove("selected");
        card.lastElementChild.removeAttribute("checked");
      }
    });
    currentCard.classList.add("selected");

    currentCard.lastElementChild.setAttribute("checked", "");

    this.state.plan = {
      name: currentCard.lastElementChild.id,
      price: currentCard.dataset.price,
    };

    this.adjustFinalCard();
  }

  selectAddon(e) {
    const currentAddon = e.target.closest(".checkbox-container");

    if (!currentAddon) return;

    currentAddon.classList.toggle("selected");

    currentAddon.firstElementChild.toggleAttribute("checked");

    let hasAddon = false;

    for (let i = 0; i < this.state.addons.length; i++) {
      if (this.state.addons[i].name === currentAddon.dataset.name) {
        hasAddon = true;
        break;
      }
    }

    if (!hasAddon) {
      this.state.addons.push({
        name: currentAddon.dataset.name,
        price: currentAddon.dataset.price,
      });
    } else {
      this.state.addons = this.state.addons.filter(
        (addon) => addon.name !== currentAddon.dataset.name
      );
    }

    this.state.addons.sort((prev, addon) => {
      if (Number(addon.price) < Number(prev.price)) {
        return 1;
      } else if (Number(addon.price) > Number(prev.price)) {
        return -1;
      } else {
        return 0;
      }
    });

    this.adjustFinalCard();
  }

  toCapitalized(string) {
    return string.at(0).toUpperCase() + string.slice(1);
  }

  sumTotalPrice() {
    let sum = Number(this.state.plan.price);

    sum += this.state.addons.reduce((acc, addon) => {
      return acc + Number(addon.price);
    }, 0);

    return sum;
  }

  adjustFinalCard() {
    const $planPrice = document.querySelector(".plan-price");

    this.$planType.innerText = `${this.toCapitalized(this.state.plan.name)} \
      (${this.toCapitalized(this.state.subscription)})`;

    $planPrice.dataset.price = this.state.plan.price;

    if (this.state.addons.length !== 0) {
      this.$services.innerHTML = this.state.addons
        .map((addon) => {
          return `
            <div class="service">
              <p class="service-name">${addon.name}</p>
              <p class="price service-price" data-price="${addon.price}">$${addon.price}/mo</p>
            </div>
          `;
        })
        .join("");
    } else {
      this.$services.innerHTML = "No add-ons were chosen";
    }

    this.$totalSubType.innerText = `${this.state.subscription.slice(0, -2)}`;

    this.$totalPrice.dataset.price = this.sumTotalPrice();

    this.countPrice();
  }
}

new Form();
