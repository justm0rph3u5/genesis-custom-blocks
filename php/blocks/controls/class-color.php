<?php
/**
 * Color control.
 *
 * @package   Block_Lab
 * @copyright Copyright(c) 2019, Block Lab
 * @license http://opensource.org/licenses/GPL-2.0 GNU General Public License, version 2 (GPL-2.0)
 */

namespace Block_Lab\Blocks\Controls;

/**
 * Class Color
 */
class Color extends Control_Abstract {

	/**
	 * Control name.
	 *
	 * @var string
	 */
	public $name = 'color';

	/**
	 * Text constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		parent::__construct();
		$this->label = __( 'Color', 'block-lab' );
	}

	/**
	 * Register settings.
	 *
	 * @return void
	 */
	public function register_settings() {
		$this->settings[] = new Control_Setting( $this->settings_config['location'] );
		$this->settings[] = new Control_Setting(
			array(
				'name'     => 'width',
				'label'    => __( 'Field Width', 'block-lab' ),
				'type'     => 'width',
				'default'  => '25',
				'sanitize' => 'sanitize_text_field',
			)
		);
		$this->settings[] = new Control_Setting( $this->settings_config['help'] );
		$this->settings[] = new Control_Setting( $this->settings_config['default'] );
	}
}
