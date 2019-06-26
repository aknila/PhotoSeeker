import { describe } from "mocha";
import { expect } from 'chai';

import { m_photo } from '../src/routes/index.types';
const index = require('../src/routes/index')

describe("Test Unit", function() {
    describe("#getCollection()", function() {
        it("if take a theme then return collectionId", async function() {
            index.getCollection('city').then((ret: number) => {
                expect(ret).to.be.a('number');
            })
        });
        it("if take a theme with an other type then return a random collectionId", async function() {
            index.getCollection(123).then((ret: number) => {
                expect(ret).to.be.a('number');
            })
        });
        it("if take null or undefined then return a random collectionId", async function() {
            index.getCollection().then((ret: number) => {
                expect(ret).to.be.a('number');
            })
        });
    });
    describe("#getPhotos()", function() {
        it("if take a collectionId valid then return an object with collection's photo", async function() {
            index.getPhotos(1224).then((ret: m_photo[]) => {
                expect(ret).to.have.length.lte(10);
            })
        });
        it("if take a collectionId with an other type then set collectionId to 1 and return an object with collection's photo", async function() {
            index.getPhotos('oui').then((ret: m_photo[]) => {
                expect(ret).to.have.length.lte(10);
            })
        });
        it("if take null or undefined then set collectionId to 1 and return an object with collection's photo", async function() {
            index.getPhotos().then((ret: m_photo[]) => {
                expect(ret).to.have.length.lte(10);
            })
        });
    });
    describe("#getLabel()", function() {
        var photoList: m_photo[] = [ { collection_id: 1243,
            picture_id: '8V8qCIIo554',
            width: 2429,
            height: 3238,
            url:
             'https://images.unsplash.com/photo-1423034816855-245e5820ff8c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjc4MjYzfQ',
            filtered_assets: [],
            available_assets: [] },
          { collection_id: 1243,
            picture_id: 'USrZRcRS2Lw',
            width: 3566,
            height: 6240,
            url:
             'https://images.unsplash.com/photo-1448317971280-6c74e016e49c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjc4MjYzfQ',
            filtered_assets: [],
            available_assets: [] },
          { collection_id: 1243,
            picture_id: 'L4iI59WB4Yw',
            width: 4806,
            height: 3204,
            url:
             'https://images.unsplash.com/photo-1474905187624-b3deaf7aa4c2?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjc4MjYzfQ',
            filtered_assets: [],
            available_assets: [] } ]
        it("if take a list of photo then return a status 200", async function() {
            index.getLabel(photoList).then((ret: any) => {
                expect(ret.status).to.be.equal(200)
            })
        });
        it("if take a list of photo then return responses length equals to photo's list length", async function() {
            index.getLabel(photoList).then((ret: any) => {
                expect(ret.data.responses).to.have.length(photoList.length)
            })
        });
        it("if take null or not valid parameter then return null", async function() {
            index.getLabel().then((ret: any) => {
                expect(ret).to.be.equal(null);
            })
        });
    });
});