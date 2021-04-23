export default function({ app, store, route, redirect }) {
  // if (!store.state.user) {
  //   if (route.path === '/logout') {
  //     return redirect('/logout');
  //   } else if (route.path === '/login') {
  //   }
  //   return redirect('/login');
  // } else {
  //   return redirect('/');
  // }
  if (route.path !== '/login') {
    //we are on a protected route
    if (!store.state.user) {
      //take them to sign in page
      return redirect('/login');
    }
  } else if (route.path === '/login') {
    // console.log(store.state.user);
    if (!store.state.user) {
      //leave them on the sign in page
    } else {
      return redirect('/');
    }
  }
}
