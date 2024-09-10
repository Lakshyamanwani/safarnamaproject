document.getElementById('rzp-button1').onclick = function(e) {
    e.preventDefault();

    var name = document.getElementById('name_5').value.trim();
    var email = document.getElementById('email_5').value.trim();
    var contact = document.getElementById('contact_5').value.trim();
    var amount = document.getElementById('amount_5').value.trim();
    var amountInPaisa = parseFloat(amount) * 100;

    var isValid = true;

    document.getElementById('name-error').style.display = 'none';
    document.getElementById('email-error').style.display = 'none';
    document.getElementById('contact-error').style.display = 'none';
    document.getElementById('amount-error').style.display = 'none';

    if (!name) {
        document.getElementById('name-error').style.display = 'inline';
        isValid = false;
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        document.getElementById('email-error').style.display = 'inline';
        isValid = false;
    }

    var contactPattern = /^[+]?(\d.*\d)?$/;
    if (!contact || !contactPattern.test(contact) || contact.length < 10) {
        document.getElementById('contact-error').style.display = 'inline';
        isValid = false;
    }

    var amountNum = parseFloat(amount);
    var minAmount = 1;
    var maxAmount = 49000;

    if (isNaN(amountNum) || amountNum < minAmount || amountNum > maxAmount) {
        document.getElementById('amount-error').style.display = 'inline';
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    fetch('/create-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            amount: amountInPaisa,
            name: name,
            email: email,
            contact: contact
        })
    })
    .then(response => response.json())
    .then(data => {
        var options = {
            "key": data.key,
            "amount": data.amount,
            "currency": "INR",
            "name": "Safarnama films",
            "description": "Advance Payment For Wedding And Prewedding",
            "image": "images/_UB_0178.jpg",
            "order_id": data.order_id,
            "handler": function(response) {
                alert("Payment Successful!\nPayment ID: " + response.razorpay_payment_id + 
                      "\nOrder ID: " + data.order_id + 
                      "\nReceipt ID: " + data.receipt_id);
            },
            "prefill": {
                "name": name,
                "email": email,
                "contact": contact
            },
            "theme": {
                "color": "#F37254"
            },
            "modal": {
                "ondismiss": function() {
                    alert("Payment process was cancelled. Please try again if you wish to complete the payment.");
                }
            }
        };

        var rzp1 = new Razorpay(options);
        rzp1.open();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while processing your payment. Please try again.');
    });
}