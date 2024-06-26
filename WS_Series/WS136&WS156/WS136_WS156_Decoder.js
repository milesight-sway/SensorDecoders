/**
 * Payload Decoder
 *
 * Copyright 2024 Milesight IoT
 *
 * @product WS136 & WS156
 */
// Chirpstack v4
function decodeUplink(input) {
    var decoded = milesightDeviceDecode(input.bytes);
    return { data: decoded };
}

// Chirpstack v3
function Decode(fPort, bytes) {
    return milesightDeviceDecode(bytes);
}

// The Things Network
function Decoder(bytes, port) {
    return milesightDeviceDecode(bytes);
}

function milesightDeviceDecode(bytes) {
    var decoded = {};

    for (var i = 0; i < bytes.length; ) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];

        // BATTERY
        if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = bytes[i];
            i += 1;
        }
        // PRESS STATE
        else if (channel_id === 0xff && channel_type === 0x34) {
            var id = bytes[i];
            var btn_chn_name = "button_" + id;
            decoded[btn_chn_name] = "trigger";
            decoded[btn_chn_name + "_d2d"] = readUInt16LE(bytes.slice(i + 1, i + 3));
            i += 3;
        } else {
            break;
        }
    }

    return decoded;
}

function readUInt16LE(bytes) {
    return (bytes[1] << 8) | bytes[0];
}

function readD2DCommand(bytes) {
    return ("0" + (bytes[1] & 0xff).toString(16)).slice(-2) + ("0" + (bytes[0] & 0xff).toString(16)).slice(-2);
}
