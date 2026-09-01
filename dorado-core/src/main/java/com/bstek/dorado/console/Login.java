package com.bstek.dorado.console;

import com.bstek.dorado.annotation.Expose;
import com.bstek.dorado.console.authentication.AuthenticationManager;
import com.bstek.dorado.view.View;
import com.bstek.dorado.web.DoradoContext;

/**
 * 登陆服务接口
 *
 *
 */
public class Login {

	@Expose
	public boolean login(String name, String password) {
		AuthenticationManager authenticationManager = Setting.getAuthenticationManager();
		return authenticationManager.authenticate(name, password);
	}

	public void onViewInit(View view) {

	}

	@Expose
	public void logout() {
		DoradoContext.getCurrent().removeAttribute(DoradoContext.SESSION, Constants.S_DORADO_CONSOLE_LOGIN_STATUS);
	}

}
