let eventBus = new Vue() 

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
 <p>
   <label for="name">Name:</label>
   <input id="name" v-model="name" placeholder="name">
 </p>

 <p>
   <label for="review">Review:</label>
   <textarea id="review" v-model="review"></textarea>
 </p>

 <p>
   <label for="rating">Rating:</label>
   <select id="rating" v-model.number="rating">
     <option>5</option>
     <option>4</option>
     <option>3</option>
     <option>2</option>
     <option>1</option>
   </select>
 </p>

 <p>
   <label>Would you recommend this product?</label>
   <input type="radio" id="yes" value="yes" v-model="recommend"> <label for="yes">Yes</label>
   <input type="radio" id="no" value="no" v-model="recommend"> <label for="no">No</label>
 </p>

 <p>
   <input type="submit" value="Submit"> 
 </p>

 <p v-if="errors.length">
 <b>Please correct the following error(s):</b>
 <ul>
   <li v-for="error in errors">{{ error }}</li>
 </ul>
</p>

</form>`,
data() {
    return {
        name: null,
        review: null,
        rating: null,
        recommend: null,
        errors: []
    }
 },
methods: {
    onSubmit() {
        this.errors = [];
        if(this.name && this.review && this.rating && this.recommend) {
            let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating,
                recommend: this.recommend
            }
            eventBus.$emit('review-submitted', productReview)
            this.name = null
            this.review = null
            this.rating = null
            this.recommend = null
        } else {
            if(!this.name) this.errors.push("Name required.")
            if(!this.review) this.errors.push("Review required.")
            if(!this.rating) this.errors.push("Rating required.")
            if(!this.recommend) this.errors.push("Recommendation required.")
        }
    }
}
})

Vue.component("product-details", {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
      <ul>
   <li v-for="detail in details">{{ detail }}</li>
      </ul>
    `
});

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        }
    },
    template: `   
       <div>   
          <ul>
            <span class="tab"
                  :class="{ activeTab: selectedTab === tab }"
                  v-for="(tab, index) in tabs"
                  @click="selectedTab = tab"
            >{{ tab }}</span>
          </ul>
          <div v-show="selectedTab === 'Reviews'">
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
              <li v-for="review in reviews" :key="review.name">
                <p>{{ review.name }}</p>
                <p>Rating: {{ review.rating }}</p>
                <p>{{ review.review }}</p>
                <p>Would you recommend this product? {{ review.recommend === 'yes' ? 'Yes' : 'No' }}</p>
              </li>
            </ul>
          </div>
          <div v-show="selectedTab === 'Make a Review'">
            <product-review @review-submitted="addReview"></product-review>
          </div>
       </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    },
    methods: {
        addReview(productReview) {
            this.$emit('review-submitted', productReview);
        }
    }
});


Vue.component("product", {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
      <div class="product">
        <div class="product-image">
            <img :src="image" :alt="altText" />
        </div>
        <div class="product-info">
            <h1>{{ title }}</h1>
            <p v-if="inStock">In Stock</p>
            <p v-else :class="{outOfStock: !inStock}">Out of Stock</p>
            <span v-if="onSale">On Sale</span>

            <product-details :details="details"></product-details>

             <p>Shipping: {{ shipping }}</p>

            <div class="color-box" v-for="(variant, index) in variants" 
                 :key="variant.variantId"
                 :style="{ backgroundColor: variant.variantColor }"
                 @mouseover="updateProduct(index)">
            </div>

            <button v-on:click="addToCart" :disabled="!inStock" 
                    :class="{ disabledButton: !inStock }">
                Add to cart
            </button>

            <button @click="removeFromCart">Remove from cart</button>
    
            <product-tabs :reviews="reviews" @review-submitted="addReview"></product-tabs>
        </div>
    </div>
    `,
    data() {
        return {
            product: "Socks",
            brand: "Vue Mastery",
            selectedVariant: 0,
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            altText: "A pair of socks",
            onSale: true,
            inventory: 100,
            sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            reviews: [],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: "../assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: "../assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ]
        };
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview);
        });
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        removeFromCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
        addReview(productReview) {
            this.reviews.push(productReview);
        }
    },
    computed: {
        title() {
            return this.brand + " " + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99;
            }
        }
    }
});

let app = new Vue({
    el: "#app",
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        removeFromCart(id) {
            let index = this.cart.indexOf(id);
            if (index !== -1) {
                this.cart.splice(index, 1);
            }
        }
    }
});