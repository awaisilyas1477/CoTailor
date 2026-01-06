// Clear cart
document.cookie = "orderId="+0 +",counter="+0

// Update badge
const badge = document.getElementById("badge");
if (badge) badge.innerHTML = 0;

// Display order details if available
const orderDetailsDiv = document.getElementById("orderDetails");
if (orderDetailsDiv) {
    const orderData = sessionStorage.getItem('orderDetails');
    if (orderData) {
        try {
            const details = JSON.parse(orderData);
            orderDetailsDiv.innerHTML = `
                <div class="order-info">
                    <h3>Order Details</h3>
                    <p><strong>Name:</strong> ${details.fullName}</p>
                    <p><strong>Phone:</strong> ${details.phone}</p>
                    ${details.email ? `<p><strong>Email:</strong> ${details.email}</p>` : ''}
                    <p><strong>Address:</strong> ${details.address}</p>
                    <p><strong>City:</strong> ${details.city}, ${details.state}${details.postalCode ? ' - ' + details.postalCode : ''}</p>
                </div>
            `;
            // Clear session storage after displaying
            sessionStorage.removeItem('orderDetails');
        } catch (error) {
            // Error displaying order details
        }
    }
}

let httpRequest = new XMLHttpRequest(),
jsonArray,
method = "GET",
jsonRequestURL = "https://5d76bf96515d1a0014085cf9.mockapi.io/order";

httpRequest.open(method, jsonRequestURL, true);
httpRequest.onreadystatechange = function()
{
    if(httpRequest.readyState == 4 && httpRequest.status == 200)
    {
        // convert JSON into JavaScript object
        jsonArray = JSON.parse(httpRequest.responseText)
        jsonArray.push(
            {
                "id": (jsonArray.length)+1, "amount": 200,"product":["userOrder"]
            })

        // send with new request the updated JSON file to the server:
        httpRequest.open("POST", jsonRequestURL, true)
        httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        httpRequest.send(jsonArray)
    }
}
httpRequest.send(null);
