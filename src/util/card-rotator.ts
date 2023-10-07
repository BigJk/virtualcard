import anime from 'animejs/lib/anime.es';

type CardState = {
	rotateX: number;
	rotateY: number;
	rotateZ: number;
	inRotation: boolean;
	lastTouchCoords: [number, number];
	lastMove: number;
	animation: anime.AnimeInstance | null;
	intervalId: any | null;
};

export type CardRotatorOptions = {
	moveFactorX?: number;
	moveFactorY?: number;
	onUpdate?: () => void;
};

export type CardRotator = {
	state: CardState;
	frontVisible: () => boolean;
	transform: () => string;
	destroy: () => void;
};

/**
 * Creates a new card rotator. This keeps track of the rotation of the card based on mouse and touch events.
 * It also animates the card to the base position when the user releases the mouse and adds a slight idle animation.
 * @param target The element to attach the rotator to.
 * @param options Options for the rotator.
 */
export default (target: HTMLElement, options?: CardRotatorOptions): CardRotator => {
	const opts = {
		moveFactorX: 0.5,
		moveFactorY: 0.5,
		...options,
	};

	const state: CardState = {
		rotateX: 0,
		rotateY: 0,
		rotateZ: 0,
		inRotation: false,
		lastTouchCoords: [0, 0],
		lastMove: Date.now(),
		animation: null,
		intervalId: null,
	};

	/**
	 * From the current rotation, determine if the front of the card is visible.
	 */
	const frontVisible = () => {
		return Math.abs(state.rotateY) % 270 < 90;
	};

	/**
	 * Normalize the rotation on Y-Axis so that it's always between -270 and 270.
	 * Normalize the rotation on X-Axis so that it's always between -2.5 and 2.5.
	 */
	const normalizeRotation = () => {
		state.rotateX = Math.min(2.5, Math.max(-2.5, state.rotateX));

		if (state.rotateY > 270) {
			state.rotateY = -90 + (state.rotateY % 270);
		} else if (state.rotateY < -270) {
			state.rotateY = 90 + (state.rotateY % 270);
		}
	};

	/**
	 * Starts a slight idle animation.
	 */
	const animateIdle = () => {
		if (state.animation) {
			return;
		}

		state.animation = anime({
			targets: state,
			rotateX: [0, 10, 0, 10, 0],
			rotateY: [state.rotateY, state.rotateY + 10, state.rotateY, state.rotateY - 10, state.rotateY],
			duration: 25000,
			loop: true,
			easing: 'easeInOutQuad',
			update: opts.onUpdate,
		});
	};

	/**
	 * Animates the card to the base position, for example when the user releases the mouse.
	 */
	const animateToSide = () => {
		if (state.animation) {
			state.animation.pause();
			state.animation = null;
		}

		normalizeRotation();

		state.animation = anime({
			targets: state,
			rotateY: frontVisible() ? 0 : state.rotateY > 0 ? 180 : -180,
			rotateX: 0,
			duration: 500,
			easing: 'easeOutQuad',
			update: opts.onUpdate,
			complete: () => {
				state.animation = null;
			},
		});
	};

	const onMouseDown = () => {
		state.inRotation = true;
		state.lastTouchCoords = [0, 0];

		target.style.cursor = 'grabbing';

		if (state.animation) {
			state.animation.pause();
			state.animation = null;
		}
	};

	const onMouseUp = () => {
		state.inRotation = false;
		state.lastTouchCoords = [0, 0];

		target.style.cursor = 'initial';

		animateToSide();
	};

	const onMouseMove = (e: MouseEvent) => {
		if (!state.inRotation) return;

		state.rotateX += e.movementY * opts.moveFactorY;
		state.rotateY -= e.movementX * opts.moveFactorX;
		state.lastMove = Date.now();

		normalizeRotation();

		opts.onUpdate?.();
	};

	const onTouchMove = (e: TouchEvent) => {
		if (!state.inRotation) return;

		const touch = e.touches[0];
		if (!touch) return;

		if (state.lastTouchCoords[0] === 0 && state.lastTouchCoords[1] === 0) {
			state.lastTouchCoords = [touch.clientY, touch.clientX];
			return;
		}

		state.rotateX += (touch.clientY - state.lastTouchCoords[0]) * opts.moveFactorY;
		state.rotateY -= (touch.clientX - state.lastTouchCoords[1]) * opts.moveFactorX;
		state.lastTouchCoords = [touch.clientY, touch.clientX];
		state.lastMove = Date.now();

		normalizeRotation();

		opts.onUpdate?.();
	};

	// Mouse events
	target.addEventListener('mousedown', (e) => onMouseDown());
	target.addEventListener('mouseup', (e) => onMouseUp());
	target.addEventListener('mousemove', (e) => onMouseMove(e as MouseEvent));
	target.addEventListener('mouseleave', (e) => onMouseUp());

	// Touch events
	target.addEventListener('touchstart', (e) => onMouseDown());
	target.addEventListener('touchend', (e) => onMouseUp());
	target.addEventListener('touchmove', (e) => onTouchMove(e as TouchEvent));

	// Idle animation trigger
	state.intervalId = setInterval(() => {
		if (state.inRotation) return;

		if (Date.now() - state.lastMove > 1000) {
			animateIdle();
		}
	}, 1000);

	return {
		state,
		frontVisible,
		transform() {
			return `rotateX(${state.rotateX}deg) rotateY(${state.rotateY}deg) rotateZ(${state.rotateZ}deg)`;
		},
		destroy() {
			state.animation?.pause();
			state.animation = null;
			clearInterval(state.intervalId);
		},
	};
};
