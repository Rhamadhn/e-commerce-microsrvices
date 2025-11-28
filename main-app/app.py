from flask import Flask, jsonify, render_template, request
import requests
from functools import lru_cache
import os

app = Flask(__name__)

product_service_host = "localhost" if os.getenv("HOSTNAME") is None else "product-service"
cart_service_host = "localhost" if os.getenv("HOSTNAME") is None else "cart-service"
review_service_host = "localhost" if os.getenv("HOSTNAME") is None else "review-service"

# @lru_cache(maxsize=128)
def get_products(product_id):
    try:
        response = requests.get(f'http://{product_service_host}:3000/products/{product_id}')
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching product data: {e}")
        return {"error": "Failed to fetch product data"}

def get_carts(product_id):
    try:
        response = requests.get(f'http://{cart_service_host}:3002/cart')
        response.raise_for_status()

        data = response.json()

        # Jika response gagal
        if not data.get("success"):
            return 0

        items = data.get("data", [])

        # Kalau datanya bukan list, aneh -> return 0
        if not isinstance(items, list):
            return 0

        # Cari item dengan product_id yang sama
        for item in items:
            if isinstance(item, dict) and item.get("product_id") == product_id:
                return item.get("quantity", 0)

        # Tidak ditemukan
        return 0

    except requests.exceptions.RequestException as e:
        print(f"Error fetching cart data: {e}")
        return 0



def get_reviews(product_id):
    try:
        response = requests.get(f'http://{review_service_host}:3003/products/{product_id}/reviews')
        response.raise_for_status()
        data = response.json()

        return data.get('data', {
            "reviews": [], 
            "product": {}
        })
    except requests.exceptions.RequestException as e:
        print(f"Error fetching review data: {e}")
        return {"error": "Failed to fetch review data"}

@app.route('/product/<int:product_id>')
def get_product_info(product_id):
    product = get_products(product_id)
    cart = get_carts(product_id)
    review = get_reviews(product_id)

    combined_response = {
        "product": product if "error" not in product else None,
        "cart": cart,
        "reviews": review.get("reviews", []) if "error" not in review else []
    }

    if request.args.get('format') == 'json':
        return jsonify({
            "data": combined_response,
            "message": "Product data fetched successfully" if product else "Failed to fetch product data"
        })

    return render_template('product.html', **combined_response)

if __name__ == '__main__':
    app.run(debug=True, port=3005, host="0.0.0.0")
