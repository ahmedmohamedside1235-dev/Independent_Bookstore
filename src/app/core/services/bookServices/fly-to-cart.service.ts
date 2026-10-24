import { Service } from '@angular/core';
import { gsap } from 'gsap';

@Service()
export class FlyToCartService {

    public shelfElement!: HTMLElement;

    registerShelfElement(element: HTMLElement) {
        this.shelfElement = element;
    }

    flyToShelf(img: HTMLElement, startElement: HTMLElement) {

        // get the position of the image and the cart
        let start = startElement.getBoundingClientRect(),
            end = this.shelfElement.getBoundingClientRect();

        // get clone from the image and set its style
        let clone = img.cloneNode(true) as HTMLElement;
        Object.assign(clone.style, {
            position: 'fixed',
            left: start.left + 'px' ,
            top: start.top + 'px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            objectFit: 'cover',
            zIndex: '9999',
            pointerEvents: 'none'
        });

        // append the clone image to the body
        document.body.appendChild(clone);

        // move image to the cart using GSAP animation
        gsap.to(clone, {
            left: end.left,
            top: end.top,
            width: 20,
            height: 20,
            opacity: 0.5,
            duration: 0.8,
            ease: 'power2.in',
            onComplete: () => clone.remove()
        });
    }
}
