package com.ft_hangouts;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;


public class MainActivity extends ReactActivity {
  @Override
  protected String getMainComponentName() {
    return "ft_hangouts";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
        return new ReactRootView(MainActivity.this);
      }
    };
  }
}
