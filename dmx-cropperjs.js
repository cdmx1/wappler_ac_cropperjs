
dmx.Component("cropperjs", {
    initialData: {
        file: null,
        cropper: null
    },
    attributes: {
        id: { type: String, default: null },
        src: { type: Array, default: null },
        viewMode: { type: Number, default: 0 },
        dragMode: { type: String, default: 'crop' },
        field_id: { type: String, default: 'image'},
        initialAspectRatio: { type: Number, default: NaN },
        aspectRatio: { type: Number, default: NaN },
        noresponsive: { type: Boolean, default: false },
        restore: { type: Boolean, default: false },
        noCheckCrossOrigin: { type: Boolean, default: false },
        noCheckOrientation: { type: Boolean, default: false },
        noModal: { type: Boolean, default: false },
        noGuides: { type: Boolean, default: false },
        noCenter: { type: Boolean, default: false },
        noHighlight: { type: Boolean, default: false },
        noBackground: { type: Boolean, default: false },
        no_auto_crop: { type: Boolean, default: false },
        auto_crop_area: { type: Number, default: 0.8 },
        noMovable: { type: Boolean, default: false },
        noRotable: { type: Boolean, default: false },
        noScalable: { type: Boolean, default: false },
        noZoomable: { type: Boolean, default: false },
        noZoomOnTouch: { type: Boolean, default: false },
        noZoomOnWheel: { type: Boolean, default: false },
        wheelZoomRatio: { type: Number, default: 0.1 },
        noCropBoxMovable: { type: Boolean, default: false },
        noCropBoxResizable: { type: Boolean, default: false },
        noToggleDragModeOnDblclick: { type: Boolean, default: false },
        minContainerWidth: { type: Number, default: 200 },
        minContainerHeigth: { type: Number, default: 100 },
        minCanvasWidth: { type: Number, default: 0 },
        minCanvasHeight: { type: Number, default: 0 },
        minCropboxWidth: { type: Number, default: 0 },
        minCropboxHeight: { type: Number, default: 0 }
    },
    methods: {
        crop: function () {
            cropper.crop()
        },
        reset: function () {
            cropper.reset()
        },
        clear: function () {
            cropper.clear()
        },
        replace: function (url, hasSameSize = false) {
            cropper.replace(url, hasSameSize)
        },
        enable: function () {
            cropper.enable()
        },
        disable: function () {
            cropper.disable()
        },
        destroy: function () {

            cropper.destroy()
        },
        move: function (x, y = x) {
            cropper.move(x, y)
        },
        moveTo: function (x, y = x) {
            cropper.moveTo(x, y)
        },
        zoom: function (ratio) {
            cropper.zoom(ratio)
        },
        zoomTo: function (ratio, pivot) {
            cropper.zoomTo(ratio, pivot)
        },
        rotate: function (degree) {
            cropper.rotate(degree)
        },
        rotateTo: function (degree) {
            cropper.rotateTo(degree)
        },
        scale: function (x, y = x) {
            cropper.scale(x, y)
        },
        scaleX: function (x) {
            cropper.scaleX(x)
        },
        scaleY: function (y) {
            cropper.scaleY(y)
        },
        getData: function (rounded = false) {
            return cropper.getData(rounded)
        },
        setData: function (data) {
            cropper.setData(data)
        },
        getContainerData: function () {
            return cropper.getContainerData()
        },
        getImageData: function () {
            return cropper.getImageData()
        },
        getCanvasData: function () {
            return cropper.getCanvasData()
        },
        setCropBoxData: function (data) {
            cropper.setCropBoxData(data)
        },
        getCroppedCanvas: function (options) {
            return cropper.getCroppedCanvas({
                viewMode: 0,  // Set viewMode to 1 for no restrictions
                aspectRatio: 16 / 9, // Adjust aspect ratio as needed
                width: 1920, // Set the desired width
                height: 1080, // Set the desired height
              })
        },
        setAspectRatio: function setAspectRatio(aspectRatio) {
            cropper.setAspectRatio(aspectRatio)
        },
        setDragMode: function setDragMode(mode = '') {
            cropper.setDragMode(mode)
        },
        crop: function (options, filename = 'file', type = 'image/png', encoder) {
            let cropper = this.get("cropper")
            this.data.canvas = cropper.getCroppedCanvas({
                viewMode: 0,  // Set viewMode to 1 for no restrictions
                aspectRatio: 16 / 9, // Adjust aspect ratio as needed
                width: 1920, // Set the desired width
                height: 1080, // Set the desired height
              })
            this.data.type = type
            this.data.encoder = encoder
            this.data.file = {}
            this.data.file.name = filename
            this.data.file.date = new Date().toISOString()
            this.data.file.dataUrl = this.data.canvas.toDataURL(type, encoder)
            this.data.file.size = atob(this.data.file.dataUrl.split(',')[1]).length
            this.data.file.type = this.data.file.dataUrl.substring(this.data.file.dataUrl.indexOf(":") + 1, this.data.file.dataUrl.indexOf(";"))
            this.dispatchEvent('cropped')
            this.attachToForm(this.parent.$node.getAttribute('id'),this.props.field_id)
            dmx.requestUpdate()    
        },
        
        
    },
    
    getInputNameById: function(inputId) {
        let inputElement = document.getElementById(inputId);
        if (inputElement) {
          return inputElement.getAttribute('name');
        } else {
          return null;
        }
    },

    attachToForm: function (form, id) {
        this.data.canvas.toBlob(function (blob) {
            let name = this.getInputNameById(id)
            document.getElementById(form).dmxExtraData[name] = new File([blob], name, { lastModified: new Date().getTime(), type: blob.type });
            console.log(document.getElementById(form).dmxExtraData[name]);
        }.bind(this), this.data.type, this.data.encoder);
    },

    resetAttachedValue: function (form, id) {
        let name = this.getInputNameById(id)
        document.getElementById(form).dmxExtraData[name] = "";
    }, 
    
    
    events: { cropped: Event },
    update: function (props) {
        if (!dmx.equal(this.props.src, props.src)) {
            this.init()
        }
    },
    render: function () {
        var parent = this.$node.parentNode;
        var wrapper = document.createElement('div');
        wrapper.className = "cropper-container"
        parent.replaceChild(wrapper, this.$node);
        wrapper.appendChild(this.$node);
        this.$node.innerHTML =  `<img id=${this.props.id + "-img"}>`;
    },
    init: function () {
        this.data.file = null
        let cropper = this.get("cropper")
        dmx.requestUpdate()
        if (cropper) {
            if (typeof cropper.destroy == 'function') {
                cropper.destroy()
            }
        }
        this.$node.querySelector('img').src = this.props.src
        var image = this.$node.querySelector('img');
        cropper = new Cropper(image, {
            container: this.props.id + "-container",
            viewMode: this.props.viewMode,
            dragMode: this.props.dragMode,
            initialAspectRatio: this.props.initialAspectRatio,
            aspectRatio: this.props.aspectRatio,
            data: this.props.data,
            preview: this.props.preview,
            responsive: !this.props.noresponsive,
            restore: this.props.restore,
            checkCrossOrigin: !this.props.noCheckCrossOrigin,
            checkOrientation: !this.props.noCheckOrientation,
            modal: !this.props.noModal,
            guides: !this.props.noGuides,
            center: !this.props.noCenter,
            highlight: !this.props.noHighlight,
            background: !this.props.noBackground,
            autoCrop: !this.props.no_auto_crop,
            auto_crop_area: this.props.auto_crop_area,
            movable: !this.props.noMovable,
            rotable: !this.props.noRotable,
            scalable: !this.props.noScalable,
            zoomable: !this.props.noZoomable,
            zoomOnTouch: !this.props.noZoomOnTouch,
            zoomOnWheel: !this.props.noZoomOnWheel,
            wheelZoomRatio: this.props.wheelZoomRatio,
            cropBoxMovable: !this.props.noCropBoxMovable,
            cropBoxResizable: !this.props.noCropBoxResizable,
            toggleDragModeOnDblclick: !this.props.noToggleDragModeOnDblclick,
            minContainerWidth: this.props.minContainerWidth,
            minContainerHeigth: this.props.minContainerHeigth,
            minCanvasWidth: this.props.minCanvasWidth,
            minCanvasHeight: this.props.minCanvasHeight,
            minCropboxWidth: this.props.minCropboxWidth,
            minCropboxHeight: this.props.minCropboxHeight
        });
        this.set("cropper",cropper)

        let parentForm = document.getElementById(this.parent.$node.getAttribute('id'));
        if(parentForm){
            parentForm.addEventListener('reset', function () {
                this.resetAttachedValue(this.parent.$node.getAttribute('id'), this.props.field_id);
            }.bind(this));
        }
       
        
    }
});
