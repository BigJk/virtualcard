import 'tachyons/css/tachyons.css';
import 'ionicons/dist/css/ionicons.css';

import m from 'mithril';

import Home from './pages/home';

m.route(document.getElementById('app')!, '/', {
	'/': Home,
});
