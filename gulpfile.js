/**
 * External dependencies
 */
const del = require( 'del' );
const fs = require( 'fs' );
const gulp = require( 'gulp' );
const run = require( 'gulp-run' );

gulp.task( 'verify:versions', function() {
	return run( 'php bin/verify-versions.php' ).exec();
} );

gulp.task( 'remove:bundle', function() {
	return del( [
		'package/assets/*',
		'package/trunk/*',
	] );
} );

gulp.task( 'install:dependencies', function() {
	return run( 'composer install -o --no-dev' ).exec();
} );

gulp.task( 'run:build', function() {
	return run( 'npm run build' ).exec();
} );

gulp.task( 'bundle', function() {
	return gulp.src( [
		'**/*',
		'!bin/**/*',
		'!node_modules/**/*',
		'!composer.*',
		'!js/src/**/*',
		'!js/tests/**/*',
		'!js/coverage/**/*',
		'!package/**/*',
	] )
		.pipe( gulp.dest( 'package/prepare' ) );
} );

gulp.task( 'wporg:prepare', function() {
	return run( 'mkdir -p package/assets package/trunk package/tags package/trunk/language' ).exec();
} );

gulp.task( 'wporg:assets', function() {
	return run( 'mv package/prepare/assets/wporg/*.* package/assets' ).exec();
} );

gulp.task( 'wporg:readme', function( cb ) {
	const changelog = fs.readFileSync( './CHANGELOG.md' ).toString();

	const readme = fs.readFileSync( './README.md' )
		.toString()
		.concat( '\n' + changelog )
		.replace( new RegExp( '###', 'g' ), '=' )
		.replace( new RegExp( '##', 'g' ), '==' )
		.replace( new RegExp( '#', 'g' ), '===' )
		.replace( new RegExp( '__', 'g' ), '*' );

	return fs.writeFile( 'package/trunk/readme.txt', readme, cb );
} );

gulp.task( 'wporg:trunk', function() {
	return run( 'mv package/prepare/* package/trunk' ).exec();
} );

gulp.task( 'clean:bundle', function() {
	const trunkDir = 'package/trunk';

	return del( [
		`${ trunkDir }/package`,
		`${ trunkDir }/artifacts`,
		`${ trunkDir }/assets/wporg`,
		`${ trunkDir }/coverage`,
		`${ trunkDir }/js/src`,
		`${ trunkDir }/js/*.map`,
		`${ trunkDir }/css/*.map`,
		`${ trunkDir }/css/src`,
		`${ trunkDir }/bin`,
		`${ trunkDir }/built`,
		`${ trunkDir }/node_modules`,
		`${ trunkDir }/tests`,
		`${ trunkDir }/trunk`,
		`${ trunkDir }/gulpfile.js`,
		`${ trunkDir }/Makefile`,
		`${ trunkDir }/package*.json`,
		`${ trunkDir }/phpunit.xml`,
		`${ trunkDir }/phpcs.xml`,
		`${ trunkDir }/postcss.config.js`,
		`${ trunkDir }/tailwind.config.js`,
		`${ trunkDir }/tsconfig.json`,
		`${ trunkDir }/README.md`,
		`${ trunkDir }/CHANGELOG.md`,
		`${ trunkDir }/CODE_OF_CONDUCT.md`,
		`${ trunkDir }/CONTRIBUTING.md`,
		`${ trunkDir }/webpack.config.js`,
		`${ trunkDir }/.github`,
		`${ trunkDir }/SHASUMS*`,
		'package/prepare',
	] );
} );

gulp.task( 'copy:tag', function() {
	return run( 'export BUILD_VERSION=$(grep "Version" genesis-custom-blocks.php | cut -f4 -d" "); [ -z "$BUILD_VERSION" ] && exit 1; mkdir -p package/tags/$BUILD_VERSION/; rm -rf package/tags/$BUILD_VERSION/*; cp -r package/trunk/* package/tags/$BUILD_VERSION/' ).exec();
} );

gulp.task( 'create:zip', function() {
	return run( 'cp -r package/trunk package/genesis-custom-blocks; export BUILD_VERSION=$(grep "Version" genesis-custom-blocks.php | cut -f4 -d" "); cd package; pwd; zip -r genesis-custom-blocks.$BUILD_VERSION.zip genesis-custom-blocks/; echo "ZIP of build: $(pwd)/genesis-custom-blocks.$BUILD_VERSION.zip"; rm -rf genesis-custom-blocks' ).exec();
} );

gulp.task( 'default', gulp.series(
	'verify:versions',
	'remove:bundle',
	'install:dependencies',
	'run:build',
	'bundle',
	'wporg:prepare',
	'wporg:assets',
	'wporg:readme',
	'wporg:trunk',
	'clean:bundle',
	'copy:tag',
	'create:zip'
) );
