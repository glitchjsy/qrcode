let cuurentCode;

function generateCode() {
    // Remove the existing code
    $("#qrcode").html("");

    const text = $("#text").val();

    // Don"t allow creating a QR code with no text
    if (text === "") {
        $("#no-text").removeClass("d-none");
        return;
    }

    // Hide the placeholder image and no text warning
    $("#qrcode-placeholder").addClass("d-none");
    $("#no-text").addClass("d-none");

    const qrcode = new QRCode({
        content: text,
        padding: 0,
        width: 256,
        height: 256,
        color: $("#foreground-color").val(),
        background: $("#background-color").val(),
        ecl: $("#ecl").val(),
        join: true,
        container: "svg-viewbox"
    });

    // Enable the download button
    $("#download-button").prop("disabled", false);

    // Show the QR code on the page
    const svg = qrcode.svg();
    $("#qrcode").html(svg);
}

function download(type) {
    const base64doc = btoa(unescape(encodeURIComponent($("#qrcode").html())));
    const a = document.createElement("a");
    const e = new MouseEvent("click");

    if (type === "svg") {
        a.download = "download.svg";
        a.href = "data:image/svg+xml;charset=utf-8;base64," + base64doc;
        a.dispatchEvent(e);
    }
    if (type === "png") {
        const image = new Image()

        image.addEventListener("load", () => {
            const qrcode = document.getElementById("qrcode").getBoundingClientRect();
            const width = qrcode.width;
            const height = qrcode.height;

            const canvas = document.createElement("canvas");

            canvas.setAttribute("width", width);
            canvas.setAttribute("height", height);

            const context = canvas.getContext("2d");
            context.drawImage(image, 0, 0, width, height);

            const dataUrl = canvas.toDataURL("image/png");

            a.download = "download.png";
            a.href = dataUrl;
            a.dispatchEvent(e);
        });
        image.src = "data:image/svg+xml;charset=utf-8;base64," + base64doc;
    }
}

$(document).ready(function () {
    // Enable color pickers
    $(".color-picker").colorpicker({
        format: "rgb",
        container: true,
        customClass: "colorpicker-2x",
        sliders: {
            saturation: {
                maxLeft: 200,
                maxTop: 200
            },
            hue: {
                maxTop: 200
            },
            alpha: {
                maxTop: 200
            }
        }
    });

    // When changing colors update the background color
    $("#background-color").on("colorpickerChange colorpickerCreate", function (e) {
        $("#background-color").css("background-color", e.value);
    });
    $("#foreground-color").on("colorpickerChange colorpickerCreate", function (e) {
        $("#foreground-color").css("background-color", e.value);
    });

    // When a color picker button is clicked open the picker
    $(".color-picker-btn").on("click", function () {
        $(".color-picker").toggle();
    });

    $("#create-button").on("click", generateCode);
    $("#download-png").on("click", () => download("png"));
    $("#download-svg").on("click", () => download("svg"));

    // Open the configuration sections
    $("[data-collapse-button]").each(function () {
        const target = $($(this).data("target"));
        const chevronIcon = $(this).find("[data-chevron-icon]");

        updateChevronIcon();

        target.on("shown.bs.collapse hidden.bs.collapse", function () {
            updateChevronIcon();
        });

        function updateChevronIcon() {
            if (target.hasClass("show")) {
                chevronIcon.removeClass("fa-chevron-down").addClass("fa-chevron-up");
            } else {
                chevronIcon.removeClass("fa-chevron-up").addClass("fa-chevron-down");
            }
        }
    });
});