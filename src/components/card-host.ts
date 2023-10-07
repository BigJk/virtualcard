import m from 'mithril';
import { css } from 'goober';

import { Card } from './card';
import cardRotator, { CardRotator } from '../util/card-rotator';

const FILL_FACTOR = 0.9;

const cardClass = css`
	-webkit-user-select: none;
	-ms-user-select: none;
	user-select: none;
	transform-style: preserve-3d;
	box-shadow: 0 70px 40px -20px rgba(0, 0, 0, 0.05);
`;

const cardFrontClass = css`
	transform: translateZ(0.1px) perspective(200px);
`;

const cardBackClass = css`
	transform: translateZ(-0.1px) perspective(200px) rotateY(180deg);
`;

type State = {
	rotator: CardRotator | null;
	width: number;
	height: number;
	scale: number;
};

export default (): m.Component<Card> => {
	const state: State = {
		rotator: null,
		width: 0,
		height: 0,
		scale: 1,
	};

	return {
		oncreate({ dom }) {
			const cardElem = dom.querySelector('#card');
			const frontElem = dom.querySelector('#front');
			if (!cardElem || !frontElem) return;

			// Save the base width and height of the card.
			state.width = frontElem.clientWidth;
			state.height = frontElem.clientHeight;

			// We need to adjust the scale so that it fits on the screen.
			// It should have about (FILL_FACTOR - 1) padding on one the longest side
			// and make sure that the other won't overflow.
			const resize = () => {
				const rect = dom.getBoundingClientRect();
				state.scale = Math.min((rect.width * FILL_FACTOR) / state.width, (rect.height * FILL_FACTOR) / state.height);
				(cardElem as HTMLElement).style.scale = state.scale.toString();
			};

			resize();
			window.addEventListener('resize', resize);

			state.rotator = cardRotator(dom as HTMLElement, {
				onUpdate: m.redraw,
			});

			m.redraw();
		},
		onremove() {
			if (state.rotator) {
				state.rotator.destroy();
			}
		},
		view({ attrs }) {
			const dynamicCardStyle = {
				width: `${state.width}px`,
				height: `${state.height}px`,
				transform: state.rotator?.transform() ?? '',
			};

			return m('div.w-100.h-100.flex.items-center.justify-center.overflow-hidden.relative', { style: { backgroundColor: attrs.background } }, [
				m(
					'div',
					m(
						`div#card.relative.${cardClass}`,
						{
							style: dynamicCardStyle,
						},
						[
							m(`div#front.absolute.left-0.top-0.${cardFrontClass}`, m(attrs.front)),
							m(`div#back.absolute.left-0.top-0.${cardBackClass}`, m(attrs.back)),
						],
					),
				), //
			]);
		},
	};
};
