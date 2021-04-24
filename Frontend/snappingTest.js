const DrawBoundsToolName = 'draw-bounds-tool';
const DrawBoundsOverlayName = 'draw-bounds-overlay';
var measurement = 0;//global variable to catpure the measurment from the device
var distance = 0; //global variable to catpure the measurment in the BIM-model
var server = null; //GATT server
var device = null; // GLM 120c
var tagString = null; // tags 
var deviceMeasurment = []; // list to store the measurments of the device
var firstmeasurment;// device measurment 
var secondmeasurment;// device measurment 
var status; // status according to din 18202

async function chooseCase() {
    var mylist = document.getElementById("myList");

    if (firstmeasurment > secondmeasurment) {
        maxDimension = firstmeasurment;
        minDimension = secondmeasurment;
    } else {
        maxDimension = secondmeasurment;
        minDimension = firstmeasurment;
    } 
    //Opening with Leibung
let grenzAbweichungMax = Math.abs(distance-maxDimension);
let grenzAbweichungMin = Math.abs(distance-minDimension);


if (mylist.value == "Opening dimension"){
    if (distance<=1 && grenzAbweichungMax <=0.001 && grenzAbweichungMin <=0.001){
        status = 'OK'
    }else if (distance >1 && distance<=3 &&grenzAbweichungMax <=0.012 && grenzAbweichungMin <=0.012) {
        status = 'OK'
    }else if (distance >3 && distance<=6 &&grenzAbweichungMax <=0.016 && grenzAbweichungMin <=0.016){
        status = 'OK'
    }else {
        status = 'NOT OK'
    }

}
//Internal diemnsion in the elevation plan

if (mylist.value == "Internal dimension in the elevation plan"){
    if (distance<=1 && grenzAbweichungMax <=0.16 && grenzAbweichungMin <=0.16){
        status = 'OK'
    }else if (distance >1 && distance<=6 &&grenzAbweichungMax <=0.2 && grenzAbweichungMin <=0.2) {
        status = 'OK'
    }else if (distance >6 && distance<=12 && grenzAbweichungMax <=0.3 && grenzAbweichungMin <=0.3){
        status = 'OK'
    }else {
        status = 'NOT OK'
    }

}
// Internal dimension in the floor plan

if (mylist.value == "Internal dimension in the floor plan"){
    if (distance<=1 && grenzAbweichungMax <=0.12 && grenzAbweichungMin <=0.12){
        status = 'OK'
    }else if (distance >1 && distance<=3 && grenzAbweichungMax <=0.16 && grenzAbweichungMin <=0.16) {
        status = 'OK'
    }else if (distance >3 && distance<=6 &&grenzAbweichungMax <=0.2 && grenzAbweichungMin <=0.2){
        status = 'OK'
    }
    else if (distance >6 && distance<=15 &&grenzAbweichungMax <=0.24 && grenzAbweichungMin <=0.24){
        status = 'OK'
    }else if (distance >15 && distance<=30 &&grenzAbweichungMax <=0.3 && grenzAbweichungMin <=0.3){
        status = 'OK'
    }
    
    else {
        status = 'NOT OK'
    }

}

if (mylist.value == "Dimensions in the elevation plan"){
    if (distance<=1 && grenzAbweichungMax <=0.1 && grenzAbweichungMin <=0.1){
        status = 'OK'
    }else if (distance >1 && distance<=6 && grenzAbweichungMax <=0.16 && grenzAbweichungMin <=0.16) {
        status = 'OK'
    }
    else if (distance >6 && distance<=15 &&grenzAbweichungMax <=0.2 && grenzAbweichungMin <=0.2){
        status = 'OK'
    }else if (distance >15 && distance<=30 &&grenzAbweichungMax <=0.3 && grenzAbweichungMin <=0.3){
        status = 'OK'
    }
    
    else {
        status = 'NOT OK'
    }

}

if (mylist.value == "Dimensions in the floor plan"){
    if (distance<=1 && grenzAbweichungMax <=0.1 && grenzAbweichungMin <=0.1){
        status = 'OK'
    }else if (distance >1 && distance<=3 && grenzAbweichungMax <=0.12 && grenzAbweichungMin <=0.12) {
        status = 'OK'
    }
    else if (distance >3 && distance<=6 &&grenzAbweichungMax <=0.16 && grenzAbweichungMin <=0.16){
        status = 'OK'
    }else if (distance >6 && distance<=15 &&grenzAbweichungMax <=0.24 && grenzAbweichungMin <=0.24){
        status = 'OK'
    }else if (distance >15 && distance<=30 &&grenzAbweichungMax <=0.3 && grenzAbweichungMin <=0.3){
        status = 'OK'
    }
    
    else {
        status = 'NOT OK'
    }

}

        const userInput = prompt(`\
             \you measured from the device: 1) ${firstmeasurment} m\
             2) ${secondmeasurment} m
             \Limit deviation  is ${parseFloat(grenzAbweichungMax.toString().slice(0, 5))} m
             \The distance in the model is ${parseFloat(distance.toString().slice(0, 5))} m
             status according to DIN 18202: ${status}`);
        if (userInput != null) {

            if (true) {
                data = {
                    project: "Master_thesis",
                    ifc_tag: tagString.data,
                    measuredValue_1: parseFloat(firstmeasurment.toString().slice(0, 5)),
                    measuredValue_2: parseFloat(secondmeasurment.toString().slice(0, 5)),

                    modelValue: parseFloat(distance.toString().slice(0, 5)),
                    deviation: parseFloat(grenzAbweichungMax.toString().slice(0, 5)),
                    status:status,
                    date: new Date().toISOString().slice(0, 10),
                    input: userInput
                }
                await axios.post('http://localhost:3000/API/userModel', data);
            }
        }


}

//few of the fucntions were wirtten according to Autodesk.Forge blog

class DrawBoundsTool extends Autodesk.Viewing.ToolInterface {
    constructor(viewer) {
        super();
        this.viewer = viewer;
        this.names = [DrawBoundsToolName];
        this.active = false;
        this.snapper = null;

        this.infoX1 = null;
        this.infoY1 = null;
        this.infoZ1 = null;

        this.infoX2 = null;
        this.infoY2 = null;
        this.infoZ2 = null;

        this.bim = null;
        this.laser = null;

        this.points = [];

        delete this.register;
        delete this.deregister;
        delete this.activate;
        delete this.deactivate;
        delete this.getPriority;
        delete this.handleMouseMove;
        delete this.handleSingleClick;
        delete this.handleKeyUp;
        delete this.update;

    }

    register() {

        this.snapper = new Autodesk.Viewing.Extensions.Snapping.Snapper(this.viewer, { renderSnappedGeometry: true, renderSnappedTopology: true });
        this.viewer.toolController.registerTool(this.snapper);
        this.viewer.toolController.activateTool(this.snapper.getName());
        console.log('DrawBoundsTool registered.');
    }

    deregister() {
        this.viewer.toolController.deactivateTool(this.snapper.getName());
        this.viewer.toolController.deregisterTool(this.snapper);
        this.snapper = null;
        console.log('DrawBoundsTool unregistered.');
    }



    getObjectId(obj, tag) {
        for (var i in obj) {
            var prop = obj[i].properties;
            if (prop.hasOwnProperty('IFC')) {
                if (prop.IFC.TAG == tag) {
                    return obj[i].objectid;
                }
            }

        }

    }


    async activate(name, viewer) {
        if (!this.active) {
            // the following gets the metadata and the ifcTag retrieved form the OCR engine from the backned-server and runs the function getObjectId which replaces each ifcTas with the obj-id generated using the Froge viewer
            const metaData = await axios.get('http://localhost:3000/metadata');
            console.log(metaData)
            tagString = await axios.get('http://localhost:3000/text');
            const forgeIds = this.getObjectId(metaData.data, tagString.data);
            console.log(forgeIds);
            //isolate the element based on the input form the backend
            this.viewer.isolate(forgeIds);


            document.getElementById("side").style.display = "block"; //add blocks

            this.infoX1 = document.getElementById("infoX1");
            this.infoY1 = document.getElementById("infoY1");
            this.infoZ1 = document.getElementById("infoZ1");

            this.infoX2 = document.getElementById("infoX2");
            this.infoY2 = document.getElementById("infoY2");
            this.infoZ2 = document.getElementById("infoZ2");

            this.bim = document.getElementById('bim');
            this.laser = document.getElementById('laser');

            device = await navigator.bluetooth.requestDevice({
                filters: [
                    { services: ['02a6c0d0-0451-4000-b000-fb3210111989'] } //use the Device UUID
                ]
                , optionalServices: ['02a6c0d0-0451-4000-b000-fb3210111989']

            },
            );

            server = await device.gatt.connect(); // connect to GATT

            let service = await server.getPrimaryService('02a6c0d0-0451-4000-b000-fb3210111989');

            console.log("connection has been established!")

            let characteristic = await service.getCharacteristic('02a6c0d1-0451-4000-b000-fb3210111989'); //Write characteristic Only, sends notifications

            //write the Sync command Number 85 to BLE, the sync command send each event to the master device (browser)

            await characteristic.writeValue(new Uint8Array([192, 85, 2, 1, 0, 26]));

            await characteristic.startNotifications();

            try {
                characteristic.addEventListener('characteristicvaluechanged', handleNotification);


            } catch (error) {
                console.error(error);
            }



            function handleNotification(event) {
                // get the values obtained form the event 
                let value = event.target.value;
                let dataview = new DataView(value.buffer)
                // exchange data container and get the 7bth Byte in float = current meaurment value
                measurement = parseFloat(dataview.getFloat32(7, true).toString().slice(0, 5));
                /*  if (measurement == 0) {
                     console.log('please do the measuring')
                 } else { */

                deviceMeasurment.push(measurement);


                
                for (var i = 0; i < deviceMeasurment.length - 1; i++) {
                    if (deviceMeasurment[i] !== 0) {
                        firstmeasurment = deviceMeasurment[i];
                        secondmeasurment = deviceMeasurment[i + 2];

                    }

                }
              

                console.log(deviceMeasurment);

            }

            this.active = true;
        }
    }

    deactivate(name) {
        if (this.active) {
            console.log('DrawBoundsTool deactivated.');

            document.getElementById("side").style.display = "none";//remove blocks

            this.viewer.isolate();

            server = device.gatt.disconnect(); // disconnect from GATT

            this.points = [];
            measurement = 0;
            distance = 0;
            this.active = false;
            alert('GLM 120c is disconnected')
        }
    }

    getPriority() {
        return 52;

    }
    // update the measurment value after each event in the laser device  
    update(highResTimestamp) {
        try {
            this.laser.innerText = `${measurement} m`;
        } catch (error) {
            console.log('It only occurs because the initial value is null', error)
        }

    }

    handleMouseMove(event) {
        if (!this.active) {
            return false;
        }


        this.snapper.indicator.clearOverlays();
        if (this.snapper.isSnapped()) {
            const result = this.snapper.getSnapResult();
            const { SnapType } = Autodesk.Viewing.MeasureCommon;
            switch (result.geomType) {
                case SnapType.SNAP_VERTEX:
                case SnapType.SNAP_MIDPOINT:
                case SnapType.SNAP_INTERSECTION:
                case SnapType.SNAP_CIRCLE_CENTER:
                case SnapType.RASTER_PIXEL:
                    case SnapType.SNAP_EDGE:

                    this.snapper.indicator.render();
                    // ignore other types of possible snapping    
                    break;

                case SnapType.SNAP_CIRCULARARC:
                    //case SnapType.SNAP_EDGE:

                    break;

                case SnapType.SNAP_FACE:
                case SnapType.SNAP_CURVEDFACE:




                    break;
            }
        }
        return false;
    }

    handleSingleClick(ev, button) {
        if (!this.active) {
            return false;
        }
        //right click = 0 according to Forge
        if (button === 0 && this.snapper.isSnapped()) {
         

            const result = this.snapper.getSnapResult();

            const { SnapType } = Autodesk.Viewing.MeasureCommon;

            switch (result.geomType) {
                case SnapType.SNAP_VERTEX:
                case SnapType.SNAP_MIDPOINT:
                case SnapType.SNAP_INTERSECTION:
                case SnapType.SNAP_CIRCLE_CENTER:
                case SnapType.RASTER_PIXEL:
                case SnapType.SNAP_EDGE:
                  

                if(result.geomType === SnapType.SNAP_EDGE){

                    // might not be the optimal solution since the coordinates are retrived relativly based on the camera position and mouse cursor position
                    let intersections = [];
                    const bounds = document.getElementById('MyViewerDiv').getBoundingClientRect();
                    this.viewer.impl.castRayViewport(this.viewer.impl.clientToViewport(ev.clientX - bounds.left, ev.clientY - bounds.top), false, null, null, intersections);
                    if (intersections.length > 0) {
                        const intersection = intersections[0];
                        let edgePoints = {x:intersection.point.x.toFixed(2),y:intersection.point.y.toFixed(2),z:intersection.point.z.toFixed(2)};
                        this.points.push(edgePoints);

                    }
                }else{
                

                        this.points.push(result.getGeometry().clone());
                    }


                     for (var i = 0; i < this.points.length - 1; i++) {

                        this.infoX1.innerText = parseFloat(this.points[i].x.toString().slice(0, 4));
                        this.infoY1.innerText = parseFloat(this.points[i].y.toString().slice(0, 4));
                        this.infoZ1.innerText = parseFloat(this.points[i].z.toString().slice(0, 4));

                        this.infoX2.innerText = parseFloat(this.points[i + 1].x.toString().slice(0, 4));
                        this.infoY2.innerText = parseFloat(this.points[i + 1].y.toString().slice(0, 4));
                        this.infoZ2.innerText = parseFloat(this.points[i + 1].z.toString().slice(0, 4));

                        let dx = this.points[i + 1].x - this.points[i].x;
                        let dy = this.points[i + 1].y - this.points[i].y;
                        let dz = this.points[i + 1].z - this.points[i].z;

                        distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2))
                        this.bim.innerText = `${Math.round(distance * 100) / 100} m`;



                        if (this.points.length > 2) {

                            this.points = [];
                            this.infoX1.innerText = '';
                            this.infoY1.innerText = '';
                            this.infoZ1.innerText = '';

                            this.infoX2.innerText = '';
                            this.infoY2.innerText = '';
                            this.infoZ2.innerText = '';

                            this.bim.innerText = '';
                            this.laser.innerText = '';
                        }


                    } 
                
        
                default:
                    // Do not snap to other types
                    break;
            }
            return true; // Stop the event from going to other tools 
        }
    
        return false;
    }


    handleKeyUp(event, keyCode) {
        if (this.active) {
            if (keyCode === 13) {

                this.points = [];

                return true;
            }
        }
        return false;
    }

}

class DrawBoundsToolExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this.tool = new DrawBoundsTool(viewer);
        this.button = null;

        this.infoX = null;
        this.infoY = null;
        this.infoZ = null;
    }

    async load() {
        await this.viewer.loadExtension('Autodesk.Snapping');
        this.viewer.toolController.registerTool(this.tool);
        console.log('DrawBoundsToolExtension has been loaded.');

        return true;
    }

    async unload() {
        this.viewer.toolController.deregisterTool(this.tool);
        console.log('DrawBoundsToolExtension has been unloaded.');
        return true;
    }

    onToolbarCreated(toolbar) {
        //create new toolbar group
        const controller = this.viewer.toolController;
        //add button to the toolbar
        this.button = new Autodesk.Viewing.UI.Button('draw-bounds-tool-button');
        this.button.onClick = (ev) => {
            if (controller.isToolActivated(DrawBoundsToolName)) {
                controller.deactivateTool(DrawBoundsToolName);
                this.button.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
            } else {
                controller.activateTool(DrawBoundsToolName);
                this.button.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
            }

        };
        this.button.setToolTip('measure one element');//incase of hovering on the button
        this.button.setIcon('buttonIcon')//put Icon on the button
        this.group = new Autodesk.Viewing.UI.ControlGroup('draw-tool-group');
        this.group.addControl(this.button);
        toolbar.addControl(this.group);
    }


}


Autodesk.Viewing.theExtensionManager.registerExtension('MeasureDistance', DrawBoundsToolExtension);