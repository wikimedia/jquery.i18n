/*!
 * jQuery Internationalization library
 *
 * Copyright (C) 2012 Santhosh Thottingal
 *
 * jquery.i18n is dual licensed GPLv2 or later and MIT. You don't have to do anything special to
 * choose one license or the other and you don't have to notify anyone which license you are using.
 * You are free to use UniversalLanguageSelector in commercial projects as long as the copyright
 * header is left intact. See files GPL-LICENSE and MIT-LICENSE for details.
 *
 * @licence GNU General Public Licence 2.0 or later
 * @licence MIT License
 */
( function ( $ ) {
	'use strict';

	$.i18n = $.i18n || {};
	$.extend( $.i18n.fallbacks, {
		aae: [ 'it' ],
		ab: [ 'ru' ],
		abs: [ 'id' ],
		ace: [ 'id' ],
		acm: [ 'ar' ],
		ady: [ 'ady-cyrl' ],
		aeb: [ 'aeb-arab' ],
		'aeb-arab': [ 'ar' ],
		aln: [ 'sq' ],
		// Not so standard - als is supposed to be Tosk Albanian,
		// but in Wikipedia it's used for a Germanic language.
		// Use 'gsw' instead. See T25215
		als: [ 'gsw', 'de' ],
		alt: [ 'ru' ],
		ami: [ 'zh-tw', 'zh-hant', 'zh', 'zh-hans' ],
		an: [ 'es' ],
		anp: [ 'hi' ],
		apc: [ 'ar' ],
		arn: [ 'es' ],
		arq: [ 'ar' ],
		ary: [ 'ar' ],
		arz: [ 'ar' ],
		ast: [ 'es' ],
		atj: [ 'fr' ],
		av: [ 'ru' ],
		avk: [ 'fr', 'es', 'ru' ],
		awa: [ 'hi' ],
		ay: [ 'es' ],
		azb: [ 'fa' ],
		ba: [ 'ru' ],
		ban: [ 'id' ],
		'ban-bali': [ 'ban' ],
		bar: [ 'de' ],
		// Deprecated: Use 'sgs' instead. See T27522
		'bat-smg': [ 'sgs', 'lt' ],
		bbc: [ 'bbc-latn' ],
		'bbc-latn': [ 'id' ],
		bcc: [ 'fa' ],
		bci: [ 'fr' ],
		bdr: [ 'ms' ],
		'be-tarask': [ 'be' ],
		// Deprecated: Use 'be-tarask' instead. See T11823
		'be-x-old': [ 'be-tarask', 'be' ],
		bew: [ 'id' ],
		bgn: [ 'fa' ],
		bh: [ 'bho' ],
		bjn: [ 'id' ],
		blk: [ 'my' ],
		bm: [ 'fr' ],
		bpy: [ 'bn' ],
		bqi: [ 'fa' ],
		btm: [ 'id' ],
		bug: [ 'id' ],
		bxr: [ 'ru' ],
		ca: [ 'oc' ],
		'cbk-zam': [ 'es' ],
		cdo: [ 'cdo-latn', 'cdo-hant', 'nan-hant', 'zh-hant', 'zh', 'zh-hans' ],
		'cdo-hant': [ 'cdo', 'cdo-latn', 'nan-hant', 'zh-hant', 'zh', 'zh-hans' ],
		'cdo-latn': [ 'cdo', 'cdo-hant', 'nan-hant', 'zh-hant', 'zh', 'zh-hans' ],
		ce: [ 'ru' ],
		co: [ 'it' ],
		cpx: [ 'cpx-hant', 'cpx-hans', 'cpx-latn', 'cdo', 'zh-hant', 'zh', 'zh-hans' ],
		'cpx-hans': [ 'cpx', 'cpx-hant', 'cpx-latn', 'cdo', 'zh-hans', 'zh', 'zh-hant' ],
		'cpx-hant': [ 'cpx', 'cpx-hans', 'cpx-latn', 'cdo', 'zh-hant', 'zh', 'zh-hans' ],
		crh: [ 'crh-latn' ],
		'crh-cyrl': [ 'tr' ],
		'crh-latn': [ 'tr' ],
		cs: [ 'sk' ],
		csb: [ 'pl' ],
		cv: [ 'ru' ],
		'de-at': [ 'de' ],
		'de-ch': [ 'de' ],
		'de-formal': [ 'de' ],
		dsb: [ 'hsb', 'de' ],
		dtp: [ 'ms' ],
		dty: [ 'ne' ],
		dua: [ 'fr' ],
		egl: [ 'it' ],
		eml: [ 'it' ],
		'es-formal': [ 'es' ],
		ext: [ 'es' ],
		fit: [ 'fi' ],
		// Deprecated: Use 'vro' instead. See T31186
		'fiu-vro': [ 'vro', 'et' ],
		fon: [ 'fr' ],
		frc: [ 'fr' ],
		frp: [ 'fr' ],
		frr: [ 'de' ],
		fur: [ 'it' ],
		gag: [ 'tr' ],
		gan: [ 'gan-hant', 'gan-hans', 'zh-hant', 'zh', 'zh-hans' ],
		'gan-hans': [ 'gan', 'gan-hant', 'zh-hans', 'zh', 'zh-hant' ],
		'gan-hant': [ 'gan', 'gan-hans', 'zh-hant', 'zh', 'zh-hans' ],
		gcf: [ 'fr' ],
		gcr: [ 'fr' ],
		gl: [ 'pt' ],
		gld: [ 'ru' ],
		glk: [ 'fa' ],
		gn: [ 'es' ],
		gom: [ 'gom-deva', 'gom-latn' ],
		'gom-deva': [ 'gom-latn' ],
		gor: [ 'id' ],
		gsw: [ 'de' ],
		guc: [ 'es' ],
		hak: [ 'zh-hant', 'zh', 'zh-hans' ],
		hif: [ 'hif-latn' ],
		hrx: [ 'de' ],
		hsb: [ 'dsb', 'de' ],
		hsn: [ 'zh-hant', 'zh', 'zh-hans' ],
		ht: [ 'fr' ],
		'hu-formal': [ 'hu' ],
		hyw: [ 'hy' ],
		iba: [ 'ms' ],
		ii: [ 'zh-cn', 'zh-hans', 'zh', 'zh-hant' ],
		'ike-cans': [ 'iu' ],
		'ike-latn': [ 'iu' ],
		inh: [ 'ru' ],
		io: [ 'eo' ],
		iu: [ 'ike-cans' ],
		jut: [ 'da' ],
		jv: [ 'id' ],
		kaa: [ 'kk-latn', 'kk-cyrl' ],
		kab: [ 'fr' ],
		kbd: [ 'kbd-cyrl' ],
		kbp: [ 'fr' ],
		kea: [ 'pt' ],
		kge: [ 'id' ],
		khw: [ 'ur' ],
		kiu: [ 'tr' ],
		kjh: [ 'ru' ],
		kjp: [ 'my' ],
		kk: [ 'kk-cyrl' ],
		'kk-arab': [ 'kk', 'kk-cyrl' ],
		'kk-cn': [ 'kk-arab', 'kk', 'kk-cyrl' ],
		'kk-cyrl': [ 'kk' ],
		'kk-kz': [ 'kk-cyrl', 'kk' ],
		'kk-latn': [ 'kk', 'kk-cyrl' ],
		'kk-tr': [ 'kk-latn', 'kk', 'kk-cyrl' ],
		kl: [ 'da' ],
		'ko-kp': [ 'ko' ],
		koi: [ 'ru' ],
		kr: [ 'knc' ],
		krc: [ 'ru' ],
		krl: [ 'fi' ],
		ks: [ 'ks-arab' ],
		ksh: [ 'de' ],
		ksw: [ 'my' ],
		ku: [ 'ku-latn' ],
		'ku-arab': [ 'ku', 'ckb' ],
		'ku-latn': [ 'ku' ],
		kum: [ 'ru' ],
		kv: [ 'ru' ],
		lad: [ 'es' ],
		lb: [ 'de' ],
		lbe: [ 'ru' ],
		lez: [ 'ru', 'az' ],
		li: [ 'nl' ],
		lij: [ 'it' ],
		liv: [ 'et' ],
		ljp: [ 'id' ],
		lki: [ 'fa' ],
		lld: [ 'it', 'rm', 'fur' ],
		lmo: [ 'pms', 'eml', 'lij', 'vec', 'it' ],
		ln: [ 'fr' ],
		lrc: [ 'fa' ],
		ltg: [ 'lv' ],
		lua: [ 'fr' ],
		luz: [ 'fa' ],
		lzh: [ 'zh-hant', 'zh', 'zh-hans' ],
		lzz: [ 'tr' ],
		mad: [ 'id' ],
		mag: [ 'hi' ],
		mai: [ 'hi' ],
		'map-bms': [ 'jv', 'id' ],
		mdf: [ 'myv', 'ru' ],
		mg: [ 'fr' ],
		mhr: [ 'mrj', 'ru' ],
		min: [ 'id' ],
		'mnc-latn': [ 'mnc' ],
		'mnc-mong': [ 'mnc' ],
		mnw: [ 'my' ],
		mo: [ 'ro' ],
		mrj: [ 'mhr', 'ru' ],
		'ms-arab': [ 'ms' ],
		mui: [ 'id' ],
		mwl: [ 'pt' ],
		myv: [ 'mdf', 'ru' ],
		mzn: [ 'fa' ],
		nah: [ 'es' ],
		nan: [ 'nan-latn-pehoeji', 'nan-latn-tailo', 'nan-hant', 'cdo', 'zh-hant', 'zh', 'zh-hans' ],
		'nan-hant': [ 'nan', 'nan-latn-pehoeji', 'nan-latn-tailo', 'cdo', 'zh-hant', 'zh', 'zh-hans' ],
		'nan-latn-pehoeji': [ 'nan-latn', 'nan-latn-tailo', 'nan', 'nan-hant', 'cdo', 'zh-hant', 'zh', 'zh-hans' ],
		'nan-latn-tailo': [ 'nan-latn', 'nan-latn-pehoeji', 'nan', 'nan-hant', 'cdo', 'zh-hant', 'zh', 'zh-hans' ],
		nap: [ 'it' ],
		nb: [ 'no', 'nn' ],
		nds: [ 'de' ],
		'nds-nl': [ 'nl' ],
		nia: [ 'id' ],
		'nl-informal': [ 'nl' ],
		nn: [ 'no', 'nb' ],
		// Deprecated: Use 'nb' or 'nn' instead.
		no: [ 'nb', 'nn' ],
		nrm: [ 'nrf', 'fr' ],
		nyo: [ 'ttj', 'nyn', 'lg', 'sw' ],
		oc: [ 'ca', 'fr' ],
		olo: [ 'fi' ],
		os: [ 'ru' ],
		pcd: [ 'fr' ],
		pdc: [ 'de' ],
		pdt: [ 'de' ],
		pfl: [ 'de' ],
		pms: [ 'it' ],
		pnt: [ 'el' ],
		pt: [ 'pt-br' ],
		'pt-br': [ 'pt' ],
		pwn: [ 'zh-tw', 'zh-hant', 'zh', 'zh-hans' ],
		qu: [ 'qug', 'es' ],
		qug: [ 'qu', 'es' ],
		rgn: [ 'it' ],
		rm: [ 'de' ],
		rmy: [ 'ro' ],
		// Deprecated: Use 'rup' instead. See T17988
		'roa-rup': [ 'rup', 'ro' ],
		'roa-tara': [ 'it' ],
		rsk: [ 'sr-cyrl', 'sr-ec' ],
		rue: [ 'uk', 'ru' ],
		rup: [ 'ro' ],
		ruq: [ 'ruq-latn', 'ro' ],
		'ruq-cyrl': [ 'mk' ],
		'ruq-latn': [ 'ro' ],
		rut: [ 'ru' ],
		sa: [ 'hi' ],
		sah: [ 'ru' ],
		scn: [ 'it' ],
		sdc: [ 'it' ],
		sdh: [ 'ckb', 'fa' ],
		se: [ 'nb', 'fi' ],
		'se-fi': [ 'se', 'fi', 'sv' ],
		'se-no': [ 'se', 'nb', 'nn' ],
		'se-se': [ 'se', 'sv' ],
		ses: [ 'fr' ],
		sg: [ 'fr' ],
		sgs: [ 'lt' ],
		sh: [ 'sh-latn', 'sh-cyrl', 'bs', 'sr-latn', 'sr-el', 'hr' ],
		'sh-cyrl': [ 'sr-cyrl', 'sr-ec', 'sh', 'sh-latn' ],
		'sh-latn': [ 'sh', 'sh-cyrl', 'bs', 'sr-latn', 'sr-el', 'hr' ],
		shi: [ 'shi-latn', 'fr' ],
		shy: [ 'shy-latn' ],
		'shy-latn': [ 'fr' ],
		sjd: [ 'ru' ],
		sk: [ 'cs' ],
		skr: [ 'skr-arab' ],
		'skr-arab': [ 'skr' ],
		sli: [ 'de' ],
		sma: [ 'sv', 'nb' ],
		smn: [ 'fi' ],
		sr: [ 'sr-cyrl', 'sr-ec', 'sr-latn', 'sr-el' ],
		'sr-cyrl': [ 'sr-ec', 'sr' ],
		'sr-ec': [ 'sr-cyrl', 'sr' ],
		'sr-el': [ 'sr-latn', 'sr' ],
		'sr-latn': [ 'sr-el', 'sr' ],
		srn: [ 'nl' ],
		sro: [ 'it' ],
		stq: [ 'de' ],
		sty: [ 'ru' ],
		su: [ 'id' ],
		szl: [ 'pl' ],
		szy: [ 'zh-tw', 'zh-hant', 'zh', 'zh-hans' ],
		tay: [ 'zh-tw', 'zh-hant', 'zh', 'zh-hans' ],
		tcy: [ 'kn' ],
		tet: [ 'pt' ],
		tg: [ 'tg-cyrl' ],
		'tg-cyrl': [ 'tg' ],
		'tg-latn': [ 'tg' ],
		trv: [ 'zh-tw', 'zh-hant', 'zh', 'zh-hans' ],
		tt: [ 'tt-cyrl', 'ru' ],
		ttj: [ 'nyo', 'nyn', 'lg', 'sw' ],
		'tt-cyrl': [ 'ru' ],
		ty: [ 'fr' ],
		tyv: [ 'ru' ],
		udm: [ 'ru' ],
		ug: [ 'ug-arab' ],
		vec: [ 'it' ],
		vep: [ 'et' ],
		vls: [ 'nl' ],
		vmf: [ 'de' ],
		vmw: [ 'pt' ],
		vot: [ 'fi' ],
		vro: [ 'et' ],
		wa: [ 'fr' ],
		wls: [ 'fr' ],
		wo: [ 'fr' ],
		wuu: [ 'wuu-hans', 'wuu-hant', 'zh-hans', 'zh', 'zh-hant' ],
		'wuu-hans': [ 'wuu', 'wuu-hant', 'zh-hans', 'zh', 'zh-hant' ],
		'wuu-hant': [ 'wuu', 'wuu-hans', 'zh-hant', 'zh', 'zh-hans' ],
		xal: [ 'ru' ],
		xmf: [ 'ka' ],
		yi: [ 'he' ],
		yue: [ 'yue-hant', 'yue-hans' ],
		'yue-hans': [ 'yue', 'yue-hant' ],
		'yue-hant': [ 'yue', 'yue-hans' ],
		za: [ 'zh-hans', 'zh', 'zh-hant' ],
		zea: [ 'nl' ],
		zh: [ 'zh-hans', 'zh-hant', 'zh-cn', 'zh-tw', 'zh-hk' ],
		// Deprecated: Use 'lzh' instead. See T30443
		'zh-classical': [ 'lzh', 'zh-hant', 'zh', 'zh-hans' ],
		'zh-cn': [ 'zh-hans', 'zh', 'zh-hant' ],
		'zh-hans': [ 'zh-cn', 'zh', 'zh-hant' ],
		'zh-hant': [ 'zh-tw', 'zh-hk', 'zh', 'zh-hans' ],
		'zh-hk': [ 'zh-hant', 'zh-tw', 'zh', 'zh-hans' ],
		// Deprecated: Use 'nan' instead. See T30442
		'zh-min-nan': [ 'nan', 'nan-latn-pehoeji', 'nan-latn-tailo', 'nan-hant', 'cdo', 'zh-hant', 'zh', 'zh-hans' ],
		'zh-mo': [ 'zh-hk', 'zh-hant', 'zh-tw', 'zh', 'zh-hans' ],
		'zh-my': [ 'zh-sg', 'zh-hans', 'zh-cn', 'zh', 'zh-hant' ],
		'zh-sg': [ 'zh-hans', 'zh-cn', 'zh', 'zh-hant' ],
		'zh-tw': [ 'zh-hant', 'zh-hk', 'zh', 'zh-hans' ],
		// Deprecated: Use 'yue' instead. See T30441
		'zh-yue': [ 'yue', 'yue-hant', 'yue-hans' ]
	} );
}( jQuery ) );
