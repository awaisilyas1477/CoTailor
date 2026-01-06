// WhatsApp Fixed Button
(function() {
    // Create WhatsApp button
    const whatsappButton = document.createElement('a');
    whatsappButton.href = 'https://wa.me/923034651965';
    whatsappButton.target = '_blank';
    whatsappButton.rel = 'noopener noreferrer';
    whatsappButton.className = 'whatsapp-float';
    whatsappButton.title = 'Contact us on WhatsApp';
    whatsappButton.innerHTML = '<i class="fab fa-whatsapp"></i>';
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .whatsapp-float {
            position: fixed;
            width: 60px;
            height: 60px;
            bottom: 20px;
            right: 20px;
            background-color: #25d366;
            color: #FFF;
            border-radius: 50px;
            text-align: center;
            font-size: 30px;
            box-shadow: 2px 2px 3px #999;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            transition: all 0.3s ease;
            animation: pulse 2s infinite;
        }
        
        .whatsapp-float:hover {
            background-color: #20ba5a;
            transform: scale(1.1);
            box-shadow: 3px 3px 5px #666;
        }
        
        .whatsapp-float i {
            margin-top: 0;
        }
        
        @keyframes pulse {
            0% {
                box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
            }
            70% {
                box-shadow: 0 0 0 10px rgba(37, 211, 102, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
            }
        }
        
        /* Responsive styles */
        @media(max-width: 767px) {
            .whatsapp-float {
                width: 55px;
                height: 55px;
                bottom: 15px;
                right: 15px;
                font-size: 28px;
            }
        }
        
        @media(max-width: 479px) {
            .whatsapp-float {
                width: 50px;
                height: 50px;
                bottom: 10px;
                right: 10px;
                font-size: 24px;
            }
        }
    `;
    
    // Add to document
    document.head.appendChild(style);
    document.body.appendChild(whatsappButton);
})();

