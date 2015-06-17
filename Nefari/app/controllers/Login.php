<?php
/**
 * The default home controller,
 * called when no controller/method has passed to the application
 */
class Login extends Controller
{
	/**
	 * The default controller method.
	 *
	 * @return void
	 */
	public function index($name = 'alex', $mood = 'happy') {
		$user = $this->model( 'User' );
		$user->name = $name;

		$this->view('home/index', [
			'name' => $user->name,
			'mood' => $mood
		]);
	}
}