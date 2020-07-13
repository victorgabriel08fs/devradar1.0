const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {

    async store(request, response) {
        const { github_username, techs, latitude, longitude } = (request.body);

        let dev = await Dev.findOne({ github_username });

        if (!dev) {

            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

            const { name = login, avatar_url, bio } = (apiResponse.data);

            const techsArray = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            })
            console.log(dev);
        }
        else {
            console.log("Usuário " + github_username + " já existe!");
        }

        return response.json(dev);
    },

    async index(request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },

    /*async delete(request, response) {
        const { id } = request.params;
        const github_username = request.headers.authorization;
        const dev = await Dev.findOne({
            github_username: {
                $eq: github_username,
            },
            
        });
        if (incident.ong_id != ong_id) {
            return response.status(401).json({ error: 'Operation not permitted.' });
        }

        await connection('incidents').where('id', id).delete();

        return response.status(204).send();

    },*/
};