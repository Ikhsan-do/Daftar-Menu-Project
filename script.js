// Data makanan
var foods = [
    {id: 1, name: "Nasi Goreng", price: 25000, desc: "Nasi goreng spesial"},
    {id: 2, name: "Mie Goreng", price: 20000, desc: "Mie goreng enak"},
    {id: 3, name: "Ayam Goreng", price: 30000, desc: "Ayam goreng krispi"},
    {id: 4, name: "Es Teh", price: 5000, desc: "Es teh manis"},
    {id: 5, name: "Kopi", price: 10000, desc: "Kopi hitam/susu"}
];

// Keranjang
var cart = [];

// Saat halaman siap
$(document).ready(function() {
    tampilkanMenu();
    updateKeranjang();
    
    // Event untuk tombol +
    $(document).on("click", ".plus", function() {
        var id = $(this).data("id");
        tambahKeKeranjang(id);
    });
    
    // Event untuk tombol -
    $(document).on("click", ".minus", function() {
        var id = $(this).data("id");
        kurangiDariKeranjang(id);
    });
    
    // Tombol pesan
    $("#pesan-btn").click(function() {
        buatPesanan();
    });
    
    // Tombol reset
    $("#reset-btn").click(function() {
        cart = [];
        tampilkanMenu();
        updateKeranjang();
        tampilkanPesan("Keranjang direset", "success");
    });
    
    // Tombol kembali
    $("#kembali-btn").click(function() {
        $("#order-page").hide();
        $(".menu").show();
        $(".cart").show();
        $("#reset-btn").show();
    });
});

// Tampilkan menu
function tampilkanMenu() {
    var html = "";
    
    for(var i = 0; i < foods.length; i++) {
        var food = foods[i];
        var item = cariDiKeranjang(food.id);
        var qty = item ? item.qty : 0;
        
        html += `
            <div class="food-item">
                <div class="food-info">
                    <div>
                        <span class="food-name">${food.name}</span>
                        <span class="food-price">Rp ${food.price.toLocaleString()}</span>
                    </div>
                    <div class="food-desc">${food.desc}</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn minus" data-id="${food.id}">-</button>
                    <span class="quantity">${qty}</span>
                    <button class="quantity-btn plus" data-id="${food.id}">+</button>
                </div>
            </div>
        `;
    }
    
    $("#menu-list").html(html);
}

// Cari di keranjang
function cariDiKeranjang(id) {
    for(var i = 0; i < cart.length; i++) {
        if(cart[i].id == id) {
            return cart[i];
        }
    }
    return null;
}

// Tambah ke keranjang
function tambahKeKeranjang(id) {
    var food = foods.find(f => f.id == id);
    if(!food) return;
    
    var item = cariDiKeranjang(id);
    
    if(item) {
        item.qty++;
    } else {
        cart.push({
            id: food.id,
            name: food.name,
            price: food.price,
            qty: 1
        });
    }
    
    tampilkanMenu();
    updateKeranjang();
    tampilkanPesan(food.name + " ditambah", "success");
}

// Kurangi dari keranjang
function kurangiDariKeranjang(id) {
    var item = cariDiKeranjang(id);
    if(!item) return;
    
    if(item.qty > 1) {
        item.qty--;
    } else {
        cart = cart.filter(i => i.id != id);
    }
    
    tampilkanMenu();
    updateKeranjang();
    tampilkanPesan("Jumlah dikurangi", "success");
}

// Update keranjang
function updateKeranjang() {
    var totalItem = 0;
    var totalHarga = 0;
    
    for(var i = 0; i < cart.length; i++) {
        totalItem += cart[i].qty;
        totalHarga += cart[i].price * cart[i].qty;
    }
    
    $("#cart-count").text(totalItem);
    $("#total-price").text(totalHarga.toLocaleString());
    
    // Aktifkan/tidak tombol pesan
    if(cart.length > 0) {
        $("#pesan-btn").prop("disabled", false);
    } else {
        $("#pesan-btn").prop("disabled", true);
    }
}

// Buat pesanan
function buatPesanan() {
    if(cart.length == 0) {
        tampilkanPesan("Keranjang kosong!", "error");
        return;
    }
    
    var html = "";
    var total = 0;
    
    // ID pesanan sederhana
    var idPesanan = "PSN" + Date.now().toString().slice(-4);
    
    html += `<p><strong>ID:</strong> ${idPesanan}</p>`;
    html += `<p><strong>Tanggal:</strong> ${new Date().toLocaleDateString()}</p>`;
    html += `<hr style="margin:10px 0">`;
    
    for(var i = 0; i < cart.length; i++) {
        var item = cart[i];
        var subtotal = item.price * item.qty;
        total += subtotal;
        
        html += `
            <div class="order-item">
                <span>${item.name} (${item.qty}x)</span>
                <span>Rp ${subtotal.toLocaleString()}</span>
            </div>
        `;
    }
    
    html += `<div class="order-total">Total: Rp ${total.toLocaleString()}</div>`;
    
    $("#order-details").html(html);
    
    // Tampilkan halaman pesanan
    $("#order-page").show();
    $(".menu").hide();
    $(".cart").hide();
    $("#reset-btn").hide();
    
    // Kosongkan keranjang
    cart = [];
    tampilkanMenu();
    updateKeranjang();
}

// Tampilkan pesan
function tampilkanPesan(text, type) {
    $("#message")
        .text(text)
        .removeClass("success error")
        .addClass(type)
        .fadeIn();
    
    setTimeout(function() {
        $("#message").fadeOut();
    }, 2000);
}