import { Pane } from 'tweakpane';
import IMOG from '~/lib/imog';

const pane = new Pane();

pane.element.parentElement.style.zIndex = 10;

IMOG.inject('gui', pane);
