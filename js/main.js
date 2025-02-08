let app = new Vue({
    el: '#app',
    data: {
        product: "Socks",
        image: "../assets/vmSocks-green-onWhite.jpg",
        link: 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks',
        altText: "A pair of socks",
        inStock: true,
        onSale: true,
        inventory: 100,
        cart: 0,
        sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        details: ['80% cotton', '20% polyester', 'Gender-neutral'],

        variants: [
            {
                variantId: 2234,
                variantColor: 'green',
                variantImage: "../assets/vmSocks-green-onWhite.jpg",
            },
            {
                variantId: 2235,
                variantColor: 'blue',
                variantImage: "../assets/vmSocks-blue-onWhite.jpg",
            }
         ],


         
    },

    methods: {
        addToCart() {
            this.cart += 1
        },
        
        updateProduct(variantImage) {
            this.image = variantImage
         },
     },
    
 });

