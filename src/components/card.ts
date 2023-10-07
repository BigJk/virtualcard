import m from 'mithril';

export type Card = {
	name: string;
	description: string;
	front: () => m.Component;
	back: () => m.Component;
	created: Date;
	background: string;
};
