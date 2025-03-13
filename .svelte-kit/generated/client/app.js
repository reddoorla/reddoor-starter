export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19')
];

export const server_loads = [0];

export const dictionary = {
		"/templates/sliders": [4],
		"/templates/sliders/plans": [5],
		"/templates/teams": [6],
		"/templates/teams/contacts": [7],
		"/templates/teams/ctas": [8],
		"/templates/teams/lists": [9],
		"/templates/teams/navs": [10],
		"/templates/teams/portfolios": [11],
		"/templates/teams/slice-simulator": [12],
		"/templates/testimonials": [13],
		"/templates/testimonials/blogs": [14],
		"/templates/testimonials/content": [15],
		"/templates/testimonials/faqs": [16],
		"/templates/testimonials/mastheads": [17],
		"/templates/values": [18],
		"/templates/values/footers": [19],
		"/[[preview=preview]]": [~2],
		"/[[preview=preview]]/[uid]": [~3]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';