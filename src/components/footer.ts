import m from 'mithril';

import { isLightColor } from '../util/color';
import { Card } from './card';

export default (): m.Component<Card> => ({
	view({ attrs }) {
		return m(
			`div.flex-shrink-0.w-100.flex.items-center.justify-between.right-0.bottom-0.code.o-50.lh-copy.pt2${
				isLightColor(attrs.background) ? '.black-80' : '.white'
			}`,

			[
				m('div.ph3.pb3', [m('a.white', { href: 'https://github.com/BigJk/virtualcard', target: '_blank' }, m('i.ion.ion-logo-github'))]),
				m('div.ph3.pb3.f6.flex', { style: { gap: '1rem' } }, [m('div.code', 'drag to rotate')]),
			],
		);
	},
});
