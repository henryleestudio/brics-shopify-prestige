  // For collection page and featured product section  updating title and price 5.9.2024 - custom code from theme.js
  this.querySelector('.product-card__info .product-title').innerText = this.product["title"] + " - " + firstMatchingVariant["title"];
 var price_html = ``;
 if(firstMatchingVariant.price < firstMatchingVariant.compare_at_price){
 price_html += `<sale-price class="h6 text-on-sale">${formatMoney(firstMatchingVariant["price"], currencyFormat)}</sale-price><compare-at-price class="h6 text-subdued line-through">${formatMoney(firstMatchingVariant["compare_at_price"], currencyFormat)}</compare-at-price>`;
 }else{
 price_html += `<sale-price class="h6 text-subdued">${formatMoney(firstMatchingVariant["price"], currencyFormat)}</sale-price>`;
 }
 this.querySelector('.product-card__info price-list').innerHTML = price_html;
// end of the code 