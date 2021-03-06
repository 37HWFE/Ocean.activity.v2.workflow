
(function (factory) {
    
    module.exports = factory(require('jquery'), require('../jquery.validate')) || module.exports;;
}(function ($) {
    /*
 * Translated default messages for the jQuery validation plugin.
 * Locale: AR (Arabic; العربية)
 */
    $.extend($.validator.messages, {
        required: '\u0647\u0630\u0627 \u0627\u0644\u062D\u0642\u0644 \u0625\u0644\u0632\u0627\u0645\u064A',
        remote: '\u064A\u0631\u062C\u0649 \u062A\u0635\u062D\u064A\u062D \u0647\u0630\u0627 \u0627\u0644\u062D\u0642\u0644 \u0644\u0644\u0645\u062A\u0627\u0628\u0639\u0629',
        email: '\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 \u0639\u0646\u0648\u0627\u0646 \u0628\u0631\u064A\u062F \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0635\u062D\u064A\u062D',
        url: '\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 \u0639\u0646\u0648\u0627\u0646 \u0645\u0648\u0642\u0639 \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0635\u062D\u064A\u062D',
        date: '\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 \u062A\u0627\u0631\u064A\u062E \u0635\u062D\u064A\u062D',
        dateISO: '\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 \u062A\u0627\u0631\u064A\u062E \u0635\u062D\u064A\u062D (ISO)',
        number: '\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 \u0639\u062F\u062F \u0628\u0637\u0631\u064A\u0642\u0629 \u0635\u062D\u064A\u062D\u0629',
        digits: '\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 \u0623\u0631\u0642\u0627\u0645 \u0641\u0642\u0637',
        creditcard: '\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 \u0631\u0642\u0645 \u0628\u0637\u0627\u0642\u0629 \u0627\u0626\u062A\u0645\u0627\u0646 \u0635\u062D\u064A\u062D',
        equalTo: '\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 \u0646\u0641\u0633 \u0627\u0644\u0642\u064A\u0645\u0629',
        extension: '\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 \u0645\u0644\u0641 \u0628\u0627\u0645\u062A\u062F\u0627\u062F \u0645\u0648\u0627\u0641\u0642 \u0639\u0644\u064A\u0647',
        maxlength: $.validator.format('\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 \u0644\u0639\u062F\u062F \u0627\u0644\u062D\u0631\u0648\u0641 \u0647\u0648 {0}'),
        minlength: $.validator.format('\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649 \u0644\u0639\u062F\u062F \u0627\u0644\u062D\u0631\u0648\u0641 \u0647\u0648 {0}'),
        rangelength: $.validator.format('\u0639\u062F\u062F \u0627\u0644\u062D\u0631\u0648\u0641 \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 \u0628\u064A\u0646 {0} \u0648 {1}'),
        range: $.validator.format('\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 \u0639\u062F\u062F \u0642\u064A\u0645\u062A\u0647 \u0628\u064A\u0646 {0} \u0648 {1}'),
        max: $.validator.format('\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 \u0639\u062F\u062F \u0623\u0642\u0644 \u0645\u0646 \u0623\u0648 \u064A\u0633\u0627\u0648\u064A (0}'),
        min: $.validator.format('\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 \u0639\u062F\u062F \u0623\u0643\u0628\u0631 \u0645\u0646 \u0623\u0648 \u064A\u0633\u0627\u0648\u064A (0}')
    });
}));