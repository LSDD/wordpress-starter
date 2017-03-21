<?php

if ( ! class_exists( 'Timber' ) ) {
	add_action( 'admin_notices', function() {
		echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="' . esc_url( admin_url( 'plugins.php#timber' ) ) . '">' . esc_url( admin_url( 'plugins.php') ) . '</a></p></div>';
	});

	add_filter('template_include', function($template) {
		return get_stylesheet_directory() . '/static/no-timber.html';
	});

	return;
}

Timber::$dirname = array('templates', 'views');

class StarterSite extends TimberSite {

	function __construct() {
  add_action( 'wp_enqueue_scripts', array( $this, 'st_styles' ) );
		add_theme_support( 'post-formats' );
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'menus' );
		add_filter( 'timber_context', array( $this, 'add_to_context' ) );
		add_filter( 'get_twig', array( $this, 'add_to_twig' ) );
		add_action( 'init', array( $this, 'register_post_types' ) );
		add_action( 'init', array( $this, 'register_taxonomies' ) );
		parent::__construct();
	}

	function register_post_types() {
		//this is where you can register custom post types
	}

	function register_taxonomies() {
		//this is where you can register custom taxonomies
	}

 function st_styles() {
   wp_enqueue_style( 'st-style', get_stylesheet_directory_uri() . '/assets/build/css/starter-theme.css', array(), '1.1', 'all');
   wp_enqueue_style( 'st-style-roboto', 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700', array(), '1.1', 'all');
  }
  wp_enqueue_script( 'st-libs-scripts', get_stylesheet_directory_uri() . '/assets/build/js/starter-theme-libs.js', array(), '1', true );
  wp_enqueue_script( 'st-scripts', get_stylesheet_directory_uri() . '/assets/build/js/starter-theme.js', array(), '1', true );
 }


	function add_to_context( $context ) {
		$context['menu'] = new TimberMenu();
		$context['site'] = $this;
		return $context;
	}

	function add_to_twig( $twig ) {
		/* this is where you can add your own functions to twig */
		$twig->addExtension( new Twig_Extension_StringLoader() );
		$twig->addFilter('myfoo', new Twig_SimpleFilter('myfoo', array($this, 'myfoo')));
		return $twig;
	}

}

new StarterSite();
