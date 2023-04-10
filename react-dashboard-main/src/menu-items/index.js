import { dashboard } from './dashboard';
// import { utilities } from './utilities';
// import { other } from './other';
import { basicsetting } from './basicsetting';
import { advancedsetting } from './advancedsetting';
import { profilesetting } from './profilesetting';

//-----------------------|| MENU ITEMS ||-----------------------//

const menuItems = {
    items: [dashboard, basicsetting, advancedsetting, profilesetting]
    ////, utilities, other
};

export default menuItems;
