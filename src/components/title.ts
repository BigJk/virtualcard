import m from 'mithril';
import { css } from 'goober';

import { Card } from './card';

import { isLightColor } from '../util/color';

// orientation landscape and smaller than 1100px height
const titleClass = css`
	@media (orientation: landscape) and (max-height: 500px) {
		display: flex;
		gap: 1rem;
	}
`;

type TitleProps = Card & {
	onShowCode?: () => void;
};

export default (): m.Component<TitleProps> => ({
	view({ attrs }) {
		return m(`div.flex-shrink-0.w-100.ph4.pt4.pb2.flex.justify-between.items-center`, [
			m(
				`div.sans-serif.bl.bw2.pl3.lh-copy.items-center${
					isLightColor(attrs.background) ? '.black-80.b--black-50' : '.white.b--white-50'
				}.${titleClass}`,
				[
					m('div.b.f4', attrs.name), //
					m('div.o-50.f6', [m('span.dib.w1.mr1', m('i.ion.ion-md-information-circle-outline')), attrs.description]),
					m('div.flex.items-center.o-50.f6', [m('span.dib.w1.mr1', m('i.ion.ion-md-calendar')), attrs.created.toDateString()]),
				],
			),
			m('i.ion.ion-md-qr-scanner.white.f2.pointer.dim', {
				onclick: attrs.onShowCode,
			}),
		]);
	},
});
