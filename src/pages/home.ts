import m from 'mithril';

import allCards from '../components/cards/all-cards';
import CardHost from '../components/card-host';
import Footer from '../components/footer';
import Title from '../components/title';
import { isLightColor } from '../util/color';

const card = allCards.sort((a, b) => a.created.getTime() - b.created.getTime())[0];

export default (): m.Component => {
	let showQrCode = false;

	return {
		view() {
			return m('div.flex.flex-column.h-100', { style: { backgroundColor: card.background } }, [
				m(Title, { ...card, onShowCode: () => (showQrCode = !showQrCode) }),
				showQrCode
					? m('div.flex-grow-1.flex.items-center.justify-center.flex-column', [
							m(
								`div.f3.mb4.f5.o-50.sans-serif${isLightColor(card.background) ? '.black-80.b--black-50' : '.white.b--white-50'}`,
								'Scan this QR code to open this card on your phone',
							),
							m(
								'div.bg-white.pa3.br2.h-50',
								{ style: { aspectRatio: '1 / 1' } },
								m('div.w-100.h-100', {
									style: {
										background: `url("https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${location.href}")`,
										backgroundSize: 'contain',
									},
								}),
							),
					  ])
					: m(CardHost, card), //
				m(Footer, card),
			]);
		},
	};
};
