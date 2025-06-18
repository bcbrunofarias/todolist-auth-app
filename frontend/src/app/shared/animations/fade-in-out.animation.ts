import { animate, AnimationTriggerMetadata, style, transition, trigger } from "@angular/animations";

export const fadeInOutAnimation = (): AnimationTriggerMetadata => {
    return trigger('fadeInOut', [
        transition(':enter', [
            style({ opacity: 0, transform: 'translateY(-10px)' }),
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ]),
        transition(':leave', [
            animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
        ])
    ]);
}