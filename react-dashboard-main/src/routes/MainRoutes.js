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

// basicsetting routing
const BookType = Loadable(lazy(() => import('../views/basic/BookType')));
const NewBookType = Loadable(lazy(() => import('../views/basic/NewBookType')));
const OriginType = Loadable(lazy(() => import('../views/basic/OriginType')));
const NewOriginType = Loadable(lazy(() => import('../views/basic/NewOriginType')));
// utilities routing
const UtilsTypography = Loadable(lazy(() => import('../views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('../views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('../views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('../views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('../views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('../views/sample-page')));

//-----------------------|| MAIN ROUTING ||-----------------------//

const MainRoutes = () => {
    const location = useLocation();

    return (
        <Route
            path={[
                '/dashboard/default',
                '/dashboard/booklist',
                '/dashboard/books/addbook',

                '/basic/basic-booktype',
                '/basic/new-booktype',
                '/basic/edit-booktype/:id',
                '/basic/basic-origintype',
                '/basic/new-origintype',
                '/basic/edit-origintype/:id',
                // 'books/edit/:id',
                // 'books/add',
                
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
                        <Route path="/utils/util-typography" component={UtilsTypography} />
                        <Route path="/utils/util-color" component={UtilsColor} />
                        <Route path="/utils/util-shadow" component={UtilsShadow} />
                        <Route path="/icons/tabler-icons" component={UtilsTablerIcons} />
                        <Route path="/icons/material-icons" component={UtilsMaterialIcons} />

                        <Route path="/sample-page" component={SamplePage} />
                    </AuthGuard>
                </Switch>
            </MainLayout>
        </Route>
    );
};

export default MainRoutes;
