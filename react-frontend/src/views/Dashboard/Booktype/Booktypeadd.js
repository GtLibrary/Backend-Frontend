import React from "react";
import { Link } from "react-router-dom";
// Chakra imports
import {
  Flex,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import TablesProjectRow from "components/Tables/TablesProjectRow";
import TablesTableRow from "components/Tables/TablesTableRow";
import { tablesProjectData, tablesTableData } from "variables/general";

function Booktypeadd() {
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
        <CardHeader p="6px 0px 22px 0px">
            <Flex justify="space-between" align="center" minHeight="60px" w="100%">
                <Text fontSize="xl" color={textColor} fontWeight="bold">
                    Add Book Type
                </Text>
                <Link to="/admin/booktype">
                    <Button
                        color="teal.300"
                        fontSize="xs"
                        variant="outline"
                    >
                        Back To List
                    </Button>
                </Link>
            </Flex>
        </CardHeader>
        <CardBody>

        </CardBody>
      </Card>
    </Flex>
  );
}

export default Booktypeadd;
