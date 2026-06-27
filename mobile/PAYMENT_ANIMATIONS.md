# Payment Animation Screens

This file documents the beautiful animations that play after payment.

## 1. Payment Processing Screen

**Shows:** While payment is being processed

**Animations:**
- 🔄 Rotating loading spinner (Lottie)
- 📊 Pulsing scale animation on container
- ⏱️ Sequenced animated dots (1, 2, 3)
- 💳 Order summary display
- 🔒 Security message

**Duration:** 4-5 seconds (or until server response)

**Components:**
- Lottie animation for processing
- Pulsing scale animation
- Staggered animated dots
- Order details card

---

## 2. Payment Success Screen

**Shows:** When payment is successful

**Animations:**
- ✅ Animated checkmark (Lottie) with scale and rotate
- 🎉 Confetti falling animation (20 items)
- ✨ Fade-in text and details
- ⬆️ Slide-up from bottom animation
- 🎊 Spring bounce effect on checkmark

**Duration:** All animations play on screen load

**Components:**
- Rotating checkmark with circle background
- 20 animated confetti pieces (gifts, stars)
- Order ID and payment details
- Delivery confirmation message
- "Track Your Order" button

**Confetti Details:**
- Random X position (-100 to 100)
- Fall duration: 1500-3000ms
- Opacity fade out
- Random delay per item

---

## 3. Payment Failed Screen

**Shows:** When payment fails

**Animations:**
- ❌ Error icon (cross) with scale animation
- 🔴 Shake animation (2 iterations)
- 📉 Fade-in text and cards
- ⬆️ Slide-up from bottom animation
- ⚠️ Helpful troubleshooting tips

**Duration:** Shake effect plays 2 times then stops

**Components:**
- Error circle with icon
- Error message and description
- Error details card with reason
- Troubleshooting tips card
- "Try Again" and "Contact Support" buttons

---

## Animation Library

All animations use:
- **Animated API** (React Native native animations)
- **Lottie** (Complex animations like confetti, checkmark, spinner)
- **Linear Gradient** (Background colors)

---

## How to Add Lottie Files

Place JSON animation files here:
```
mobile/src/animations/lottie/
├── success-checkmark.json
├── processing.json
├── confetti.json
└── delivery-truck.json
```

Download from: [LottieFiles](https://lottiefiles.com/)

---

## Customization

### Change Confetti Duration
```javascript
const randomDuration = Math.random() * 1500 + 1500; // 1.5-3s
```

### Change Shake Intensity
```javascript
const shakeDistance = 10; // pixels
```

### Change Colors
```javascript
const colors = ['#FF6B35', '#FF8C42', '#FFA500', '#FFB84D'];
```

### Change Scale/Rotation
```javascript
scaleAnim: new Animated.Value(0) // starts at 0, animates to 1
rotateAnim: new Animated.Value(0) // 0 to 360 degrees
```
