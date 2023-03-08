import React, { lazy } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

// project imports
import MainLayout from './../layout/MainLayout';
import Loadable from '../ui-component/Loadable';
import AuthGuard from './../utils/route-guard/AuthGuard';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('../views/dashboard/Default')));
const Booklist = Loadable(lazy(() => import('../views/dashboard/books/Booklist')));
const BookAdd = Loadable(lazy(() => import('../views/dashboard/books/BookAdd')));
const BookContent = Loadable(lazy(() => import('../views/dashboard/books/BookContent')));
const PrintBook = Loadable(lazy(() => import('../views/dashboard/books/PrintBook')));
const BookAdContent = Loadable(lazy(() => import('../views/dashboard/books/BookAdContent')));
const Balance = Loadable(lazy(() => import('../views/dashboard/balance/Balance')));
const GetBenjiKey = Loadable(lazy(() => import('../views/dashboard/getapikey/getapikey')))
// basicsetting routing
const BookType = Loadable(lazy(() => import('../views/basic/BookType')));
const NewBookType = Loadable(lazy(() => import('../views/basic/NewBookType')));
const OriginType = Loadable(lazy(() => import('../views/basic/OriginType')));
const NewOriginType = Loadable(lazy(() => import('../views/basic/NewOriginType')));
const SetAIPrice = Loadable(lazy(() => import('../views/basic/SetAIPrice')));
// profile setting
const ProfileSetting = Loadable(lazy(() => import('../views/profile/setting')));
const ChangePass = Loadable(lazy(() => import('../views/profile/changepassword')));
// utilities routing
const UtilsTypography = Loadable(lazy(() => import('../views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('../views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('../views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('../views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('../views/utilities/TablerIcons')));

//-----------------------|| MAIN ROUTING ||-----------------------//

const MainRoutes = () => {
    const location = useLocation();

    return (
        <Route
            path={[
                '/dashboard/default',
                '/dashboard/booklist',
                '/dashboard/books/addbook',
                '/dashboard/books/edit/:bookid',
                '/dashboard/books/contentedit/:id',
                '/dashboard/books/adcontent/:id',
                '/dashboard/books/printbook/:bookid',
                '/dashboard/balance',
                '/dashboard/getapikey',

                '/basic/basic-booktype',
                '/basic/new-booktype',
                '/basic/edit-booktype/:id',
                '/basic/basic-origintype',
                '/basic/new-origintype',
                '/basic/edit-origintype/:id',
                '/basic/setaiprice',
                // 'books/edit/:id',
                // 'books/add',

                '/profile/setting',
                '/profile/changepassword',
                
                '/utils/util-typography',
                '/utils/util-color',
                '/utils/util-shadow',
                '/icons/tabler-icons',
                '/icons/material-icons',

                '/sample-page'
            ]}
        >
            <MainLayout>
                <Switch location={location} key={location.pathname}>
                    <AuthGuard>
                        <Route path="/dashboard/default" component={DashboardDefault} />
                        <Route path="/dashboard/booklist" component={Booklist} />
                        <Route path="/dashboard/books/addbook" 
                        render = {(props) => (
                            <BookAdd {...props} action="new" />
                        )
                        } />
                        <Route path="/dashboard/books/edit/:bookid" 
                        render = {(props) => (
                            <BookAdd {...props} action="edit" />
                        )
                        } />
                        <Route path="/dashboard/books/contentedit/:id" 
                        render = {(props) => (
                            <BookContent {...props} action="edit" />
                        )
                        } />
                        <Route path="/dashboard/books/adcontent/:id" 
                        render = {(props) => (
                            <BookAdContent {...props} action="edit" />
                        )
                        } />
                        <Route path="/dashboard/books/printbook/:bookid"
                        render={(props) => (
                            <PrintBook {...props} action="edit" />
                        )
                        } />
                        <Route path="/dashboard/balance" component={Balance} />
                        <Route path="/dashboard/getapikey" component={GetBenjiKey} />

                        <Route path="/basic/basic-booktype" component={BookType} />
                        <Route path="/basic/new-booktype" 
                        render = {(props) => (
                            <NewBookType {...props} action="new" />
                        )
                        } />
                        <Route path="/basic/edit-booktype/:id"  
                        render = {(props) => (
                            <NewBookType {...props} action="edit" />
                        )
                        }  />
                        <Route path="/basic/basic-origintype" component={OriginType} />
                        <Route path="/basic/new-origintype" 
                        render = {(props) => (
                            <NewOriginType {...props} action="new" />
                        )
                        } />
                        <Route path="/basic/edit-origintype/:id"  
                        render = {(props) => (
                            <NewOriginType {...props} action="edit" />
                        )
                        }  />
                        <Route path="/basic/setaiprice" component={SetAIPrice} />

                        <Route path="/profile/setting" component={ProfileSetting} />
                        <Route path="/profile/changepassword" component={ChangePass} />

                        <Route path="/utils/util-typography" component={UtilsTypography} />
                        <Route path="/utils/util-color" component={UtilsColor} />
                        <Route path="/utils/util-shadow" component={UtilsShadow} />
                        <Route path="/icons/tabler-icons" component={UtilsTablerIcons} />
                        <Route path="/icons/material-icons" component={UtilsMaterialIcons} />

                    </AuthGuard>
                </Switch>
            </MainLayout>
        </Route>
    );
};

export default MainRoutes;
